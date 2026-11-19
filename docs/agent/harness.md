# 에이전트 하네스

하네스는 에이전트가 일하는 환경 전체다. 규칙 문서, 훅, 검증 스크립트로 이루어진다. CIRQLE-Native-Mobile 하네스를 FestiCore-Backend · iOS · AdminWeb과 같은 구조로 옮기고 토큰 생성기 저장소에 맞게 바꿨다.

- 프롬프트 지시는 확률이고 실행되는 검사는 보장이다. 같은 실수가 반복되면 문서보다 검사로 막는다.

## 구성

| 종류 | 위치 | 역할 |
| --- | --- | --- |
| 진입점 | `CLAUDE.md` · `README.md` · `docs/` | 토큰 구조 · 생성 명령 |
| 훅 | `.claude/hooks/*` + `.claude/settings.json` | git 규칙 강제 · 종료 확인 · 사용 기록 |
| 스크립트 | `.claude/scripts/verify` · `harness-report` | 검증 · 사용 리포트 |
| 로컬 상태 | `.claude/state/` (git 제외) | `verify.json` · 단계별 로그 · `usage.jsonl` |

## 훅

| 이벤트 | 스크립트 | 내용 |
| --- | --- | --- |
| `PreToolUse` (Bash) | `check-git-rules.sh` → `check_git_rules.py` | 아래 검사 |
| `PostToolUse` (Read · Skill) | `usage_log.py` | `docs/` · `CLAUDE.md` · 스킬 사용 기록 |
| `Stop` | `stop_guard.py` | 검증 안 된 코드 변경이 있으면 응답 종료를 한 번 막는다 |

`git commit` · `git push` 검사:

1. `main`에서 커밋 · 푸시 금지, `main`으로 직접 푸시 · 삭제 금지. 이 저장소는 develop 없이 작업 브랜치에서 `main`으로 PR을 보내 머지한다.
2. 브랜치 이름: `<종류>/<영문 소문자 kebab-case>`. 종류는 `feature` · `feat` · `fix` · `docs` · `refactor` · `test` · `chore` · `hotfix` · `release` · `sync`.
3. 커밋 제목: 한국어, 끝에 `#이슈번호`(예: `… #15`), 스쿼시 머지의 ` (#16)` 허용.
4. `Co-Authored-By` 금지(대소문자 무관, `--trailer` 포함).
5. `.DS_Store` · `.env`(`.env.example` 제외) · `*.pem|p8|p12|key` · `credentials*.json` 등 스테이징 금지.
6. 검증 게이트: 코드 변경이 있는데 `verify.json`의 통과 지문과 작업 트리 지문이 다르면 막는다. 다른 저장소를 커밋하면 그 저장소의 `harness_state.py`로 판정한다.

```bash
bash .claude/hooks/check-git-rules.sh --check-message "하네스를 더한다 #15" < /dev/null
bash .claude/hooks/check-git-rules.sh --check-branch "feature/agent-harness" < /dev/null
python3 -m unittest discover -s .claude/hooks/tests < /dev/null
```

- 개인 전역 gitignore가 `.claude/`를 무시하면 하네스 파일은 `git add -f`로 올린다.

## 검증 게이트

```bash
.claude/scripts/verify < /dev/null          # main 이후 바뀐 코드에 맞는 단계만
.claude/scripts/verify --all < /dev/null    # 모든 단계
```

| 바뀐 경로 | 단계 | 명령 |
| --- | --- | --- |
| `.claude/hooks` · `scripts` · `settings.json` | harness-syntax · harness-tests | `bash -n` · JSON 파싱 · `unittest` |
| `scripts/` · `tokens/` · `generated/` · `tests/` · `package*.json` · `tsconfig.json` · `.nvmrc` | typecheck · unit · check | `npm run typecheck` · `npm test` · `npm run check` |

- 명령은 CI(`.github/workflows/tokens.yml`)와 같다. `check`는 `generated/`가 `tokens/`에서 다시 만든 결과와 같은지 본다. `.md`만 바뀌면 검증하지 않는다.
- 모든 명령은 stdin `/dev/null`로 돌리고 출력은 `.claude/state/verify/<단계>.log`에 남긴다.
- 통과하면 코드 내용 지문을 `verify.json`에 남긴다. 통과 후 코드를 고치면 다시 돌린다. 같은 단계가 연속 2번 실패하면 세 번째 전에 사용자에게 보고한다.
- 생성된 Swift가 FestiCore-iOS에서 빌드되는지는 verify가 확인하지 못한다. iOS 저장소에 반영할 때 그쪽 verify로 본다.

## 관측과 한계

- `.claude/scripts/harness-report [--days 90]`: 문서 · 스킬 사용 횟수와 안 쓰인 문서.
- 훅은 실수를 막는 장치이지 보안 경계가 아니다. `env git commit` · 셸 변수 · 편집기 메시지, `gh api`로 하는 머지는 검사하지 않는다.
- `gh pr merge --squash`의 제목 · 본문은 검사하지 않는다. 직접 지정하고 머지 후 커밋 메시지를 확인한다.
- Codex에는 Claude 훅이 걸리지 않는다. 커밋 전에 위 직접 검사와 verify를 실행한다.
- 규칙을 바꾸면 같은 PR에서 문서와 훅을 함께 고친다.
