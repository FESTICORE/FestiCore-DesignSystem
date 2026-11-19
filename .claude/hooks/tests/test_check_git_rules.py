import importlib.machinery
import importlib.util
import json
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile
import unittest


HOOKS = pathlib.Path(__file__).resolve().parents[1]
REPO = HOOKS.parents[1]
SCRIPTS = REPO / ".claude" / "scripts"


def load_script(name, path):
    loader = importlib.machinery.SourceFileLoader(name, str(path))
    spec = importlib.util.spec_from_loader(name, loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


def run(*args, cwd, check=True):
    return subprocess.run(list(args), cwd=cwd, capture_output=True, text=True, check=check, stdin=subprocess.DEVNULL)


class GitRulesHookTests(unittest.TestCase):
    """실제 git 저장소(임시)에 훅을 복사해 PreToolUse 입력 그대로 실행한다."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="harness-test-")
        self.repo = os.path.join(self.tmp, "repo")
        os.makedirs(os.path.join(self.repo, "scripts"))
        shutil.copytree(HOOKS, os.path.join(self.repo, ".claude", "hooks"),
                        ignore=shutil.ignore_patterns("tests", "__pycache__"))
        run("git", "init", "-q", "-b", "main", cwd=self.repo)
        run("git", "config", "user.name", "tester", cwd=self.repo)
        run("git", "config", "user.email", "tester@example.com", cwd=self.repo)
        with open(os.path.join(self.repo, "scripts", "a.ts"), "w") as f:
            f.write("export const a = 1;\n")
        shutil.copyfile(REPO / ".gitignore", os.path.join(self.repo, ".gitignore"))
        # 실제 저장소처럼 훅을 추적한다(개인 전역 gitignore가 .claude/를 무시해도).
        run("git", "-c", "core.excludesFile=/dev/null", "add", "-A", cwd=self.repo)
        run("git", "commit", "-q", "-m", "init", cwd=self.repo)
        run("git", "checkout", "-q", "-b", "feature/agent-harness", cwd=self.repo)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def hook(self, command, cwd=None):
        payload = json.dumps({"tool_input": {"command": command}, "cwd": cwd or self.repo})
        return subprocess.run(["bash", os.path.join(self.repo, ".claude", "hooks", "check-git-rules.sh")],
                              input=payload, capture_output=True, text=True)

    def direct(self, *args):
        return subprocess.run(["bash", os.path.join(self.repo, ".claude", "hooks", "check-git-rules.sh"), *args],
                              capture_output=True, text=True)

    def assertBlocked(self, result, text):
        self.assertEqual(2, result.returncode, result.stderr)
        self.assertIn(text, result.stderr)

    def test_non_git_command_passes(self):
        self.assertEqual(0, self.hook("ls -la").returncode)
        self.assertEqual(0, self.hook('echo "git commit -m x"').returncode)

    def test_valid_commit_passes(self):
        self.assertEqual(0, self.hook('git commit -m "하네스를 맞춘다 #396"').returncode)

    def test_protected_branch_commit_and_push_blocked(self):
        run("git", "checkout", "-q", "main", cwd=self.repo)
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396"'), "보호 브랜치")
        self.assertBlocked(self.hook("git push origin main"), "보호 브랜치")
        self.assertBlocked(self.hook("git push"), "보호 브랜치")

    def test_push_to_protected_from_feature_blocked(self):
        self.assertBlocked(self.hook("git push origin HEAD:main"), "직접 푸시")
        self.assertBlocked(self.hook("git push origin --delete main"), "삭제")
        self.assertEqual(0, self.hook("git push -u origin feature/agent-harness").returncode)

    def test_branch_name(self):
        run("git", "checkout", "-q", "-b", "wip/harness", cwd=self.repo)
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396"'), "브랜치 이름")
        self.assertBlocked(self.direct("--check-branch", "feature/Agent_Harness"), "브랜치 이름")
        self.assertBlocked(self.direct("--check-branch", "feature/#27"), "브랜치 이름")
        for name in ("feature/more-settings-home", "fix/152-live-activity", "feat/admin-auth", "docs/api-specs"):
            self.assertEqual(0, self.direct("--check-branch", name).returncode, name)

    def test_english_subject_blocked(self):
        self.assertBlocked(self.hook('git commit -m "Add agent harness #396"'), "한국어")

    def test_missing_issue_number_blocked(self):
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다"'), "이슈 번호")
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #"'), "이슈 번호")
        self.assertBlocked(self.direct("--check-message", "#396 하네스를 맞춘다"), "이슈 번호")

    def test_env_and_credentials_blocked(self):
        for path in (".env", "config/.env.production", "keys/AuthKey_ABC.p8", "service-account.json"):
            full = os.path.join(self.repo, path)
            os.makedirs(os.path.dirname(full), exist_ok=True)
            open(full, "w").close()
            run("git", "add", "-f", path, cwd=self.repo)
            self.assertBlocked(self.hook('git commit -m "설정을 더한다 #396"'), "자격 증명", )
            run("git", "rm", "-q", "--cached", path, cwd=self.repo)
        open(os.path.join(self.repo, ".env.example"), "w").close()
        run("git", "add", "-f", ".env.example", cwd=self.repo)
        self.assertEqual(0, self.hook('git commit -m "예시 설정을 더한다 #396"').returncode)

    def test_main_pr_allowed(self):
        # 이 저장소는 develop 없이 main으로 PR을 보내고 머지한다
        self.assertEqual(0, self.hook('gh pr create --base main --title "토큰을 더한다 #396"').returncode)
        self.assertEqual(0, self.hook('gh pr merge 1 --squash').returncode)

    def test_cirqle_type_prefix_is_not_required(self):
        self.assertEqual(0, self.direct("--check-message", "하네스를 맞춘다 #396").returncode)
        self.assertEqual(0, self.direct("--check-message", "S10 화면을 맞춘다 #396 (#510)").returncode)

    def test_heredoc_message_checked(self):
        command = "git commit -F - <<'EOF'\nAdd harness #396\n\n본문\nEOF"
        self.assertBlocked(self.hook(command), "한국어")
        command = "git commit -F - <<'EOF'\n하네스를 맞춘다 #396\n\n본문\nEOF"
        self.assertEqual(0, self.hook(command).returncode)
        command = 'git commit -m "$(cat <<\'EOF\'\nAdd harness #396\n\n본문\nEOF\n)"'
        self.assertBlocked(self.hook(command), "한국어")

    def test_co_authored_by_blocked(self):
        command = ('git commit -m "$(cat <<\'EOF\'\n하네스를 맞춘다 #396\n\n'
                   'Co-Authored-By: Claude <noreply@anthropic.com>\nEOF\n)"')
        self.assertBlocked(self.hook(command), "Co-Authored-By")
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396" -m "co-authored-by: x <x@y>"'),
                           "Co-Authored-By")
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396" --trailer "Co-authored-by: x <x@y>"'),
                           "Co-Authored-By")

    def test_ds_store_blocked(self):
        open(os.path.join(self.repo, ".DS_Store"), "w").close()
        run("git", "add", "-f", ".DS_Store", cwd=self.repo)
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396"'), ".DS_Store")

    def test_unverified_code_blocked_until_verify_record_matches(self):
        sys.path.insert(0, os.path.join(self.repo, ".claude", "hooks"))
        import harness_state as hs
        config = os.path.join(self.repo, "scripts", "a.ts")
        with open(config, "a") as f:
            f.write("export const b = 2;\n")
        run("git", "add", "-A", "scripts", cwd=self.repo)
        self.assertBlocked(self.hook('git commit -m "설정을 바꾼다 #396"'), "검증하지 않은")
        hs.save(self.repo, {"passed": True, "fingerprint": hs.fingerprint(self.repo)})
        self.assertEqual(0, self.hook('git commit -m "설정을 바꾼다 #396"').returncode)
        with open(config, "a") as f:
            f.write("export const c = 3;\n")
        self.assertBlocked(self.hook('git commit -m "설정을 바꾼다 #396"'), "검증하지 않은")

    def test_other_repo_commit_uses_its_own_harness_state(self):
        other = os.path.join(self.tmp, "other")
        os.makedirs(os.path.join(other, "scripts"))
        os.makedirs(os.path.join(other, ".claude", "hooks"))
        with open(os.path.join(other, ".claude", "hooks", "harness_state.py"), "w") as f:
            f.write("def unverified(root):\n    return []\n")  # 그 저장소 규칙으로는 검증할 변경이 없다
        run("git", "init", "-q", "-b", "main", cwd=other)
        run("git", "config", "user.name", "tester", cwd=other)
        run("git", "config", "user.email", "tester@example.com", cwd=other)
        run("git", "commit", "-q", "--allow-empty", "-m", "init", cwd=other)
        run("git", "checkout", "-q", "-b", "feature/other-change", cwd=other)
        with open(os.path.join(other, "scripts", "b.ts"), "w") as f:
            f.write("export const b = 2;\n")
        run("git", "add", "-A", "scripts", cwd=other)
        self.assertEqual(0, self.hook(f'git -C {other} commit -m "다른 저장소를 고친다 #396"').returncode)
        os.remove(os.path.join(other, ".claude", "hooks", "harness_state.py"))  # 없으면 이 저장소 규칙으로 막는다
        self.assertBlocked(self.hook(f'git -C {other} commit -m "다른 저장소를 고친다 #396"'), "검증하지 않은")

    def test_docs_only_change_needs_no_verify(self):
        for path in ("README.md", "scripts/README.md"):
            with open(os.path.join(self.repo, path), "w") as f:
                f.write("x")
        run("git", "add", "-A", cwd=self.repo)
        self.assertEqual(0, self.hook('git commit -m "문서를 고친다 #396"').returncode)

    def test_worktree_reads_gitdir_head(self):
        worktree = os.path.join(self.tmp, "wt")
        run("git", "worktree", "add", "-q", worktree, "main", cwd=self.repo)
        shutil.copytree(os.path.join(self.repo, ".claude", "hooks"), os.path.join(worktree, ".claude", "hooks"),
                        dirs_exist_ok=True)
        self.assertTrue(os.path.isfile(os.path.join(worktree, ".git")))
        sys.path.insert(0, str(HOOKS))
        import check_git_rules
        head = check_git_rules.head_file(os.path.join(worktree, "scripts"))
        self.assertIn(os.path.join(".git", "worktrees"), head)
        self.assertEqual("main", check_git_rules.current_branch(worktree))
        self.assertEqual("feature/agent-harness", check_git_rules.current_branch(self.repo))
        # 메인 checkout은 feature 브랜치지만 worktree는 main이므로 막혀야 한다
        self.assertBlocked(self.hook('git commit -m "하네스를 맞춘다 #396"', cwd=worktree), "보호 브랜치")
        self.assertBlocked(self.hook(f'cd {worktree} && git commit -m "하네스를 맞춘다 #396"'), "보호 브랜치")

    def test_stop_guard_blocks_once(self):
        with open(os.path.join(self.repo, "scripts", "a.ts"), "a") as f:
            f.write("export const b = 2;\n")
        guard = os.path.join(self.repo, ".claude", "hooks", "stop_guard.py")
        result = subprocess.run(["python3", "-I", "-S", guard], input=json.dumps({"cwd": self.repo}),
                                capture_output=True, text=True)
        self.assertEqual("block", json.loads(result.stdout)["decision"])
        result = subprocess.run(["python3", "-I", "-S", guard],
                                input=json.dumps({"cwd": self.repo, "stop_hook_active": True}),
                                capture_output=True, text=True)
        self.assertEqual("", result.stdout)


class VerifyTests(unittest.TestCase):
    def setUp(self):
        self.cwd = os.getcwd()
        os.chdir(REPO)
        self.verify = load_script("verify", SCRIPTS / "verify")

    def tearDown(self):
        os.chdir(self.cwd)

    def test_steps_for_paths(self):
        names = lambda files, run_all=False: [n for n, _ in self.verify.steps_for(files, run_all)]
        self.assertEqual([], names([]))
        self.assertEqual(["harness-syntax", "harness-tests"], names([".claude/hooks/check_git_rules.py"]))
        self.assertEqual(["typecheck", "unit", "check"], names(["scripts/build-ios.ts"]))
        self.assertEqual(["typecheck", "unit", "check"], names(["tokens/color.json"]))
        self.assertEqual(["typecheck", "unit", "check"], names(["package.json"]))
        self.assertEqual(["harness-syntax", "harness-tests", "typecheck", "unit", "check"], names([], True))

    def test_docs_are_not_code(self):
        sys.path.insert(0, str(HOOKS))
        import harness_state as hs
        self.assertFalse(hs.is_code("docs/agent/harness.md"))
        self.assertFalse(hs.is_code("README.md"))
        self.assertTrue(hs.is_code("scripts/build-ios.ts"))
        self.assertTrue(hs.is_code("generated/ios/Color.swift"))
        self.assertTrue(hs.is_code("package.json"))
        self.assertTrue(hs.is_code(".claude/hooks/check_git_rules.py"))


if __name__ == "__main__":
    unittest.main()
