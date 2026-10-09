# brt-design-system — คำสั่งที่ใช้บ่อย (ห่อ pnpm scripts)
# ใช้ `make help` เพื่อดูคำสั่งทั้งหมด
# publish ขึ้น npm ไม่มีใน Makefile โดยตั้งใจ — คนทำตาม README.dev.md เท่านั้น (AI ห้าม publish)

PACK_DIR ?= .pack

.DEFAULT_GOAL := help
.PHONY: help install build dev test typecheck lint lint-fix format format-check check \
	storybook storybook-stop build-storybook changeset pack clean clean-all

help: ## แสดงคำสั่งทั้งหมด
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## ติดตั้ง dependency (pnpm ตาม packageManager)
	pnpm install

build: ## build ทุก package (design ก่อนเสมอ)
	pnpm build

dev: ## turbo dev ทุก package
	pnpm dev

test: ## vitest ทุก package — token coverage ทุก brand × mode × viewport
	pnpm test

typecheck: ## tsc --noEmit ทุก package (รวมการตรวจว่า antd map token ครบ)
	pnpm typecheck

lint: ## ESLint
	pnpm lint

lint-fix: ## ESLint --fix
	pnpm lint:fix

format: ## prettier --write ทั้ง repo
	pnpm format

format-check: ## prettier --check ทั้ง repo
	pnpm format:check

check: ## ตรวจก่อนส่งงาน: build → typecheck → lint → test → format-check
	pnpm build
	pnpm typecheck
	pnpm lint
	pnpm test
	pnpm format:check

storybook: ## Storybook ทุกตัว → http://localhost:6006 (ปิดด้วย Ctrl+C หรือ make storybook-stop)
	pnpm storybook

storybook-stop: ## ปิด Storybook ที่ค้างอยู่ (port 6006–6008 ถูกจอง)
	-pkill -f "storybook/dist/bin/dispatcher.js dev"

build-storybook: ## static build ของ Storybook ลง apps/*/storybook-static
	pnpm build-storybook

changeset: ## บันทึกการเปลี่ยนแปลงของ package ก่อนเปิด PR
	pnpm changeset

pack: build ## pnpm pack ทุก package ลง .pack/ เพื่อตรวจไฟล์ก่อน publish (ไม่ publish)
	rm -rf $(PACK_DIR) && mkdir -p $(PACK_DIR)
	pnpm -r --filter "./packages/*" exec pnpm pack --pack-destination $(CURDIR)/$(PACK_DIR)
	@for f in $(PACK_DIR)/*.tgz; do echo "\n== $$f"; tar -tzf $$f | sed 's|^package/|  |'; done

clean: ## ลบ build output (dist, .turbo, storybook-static, .pack)
	rm -rf packages/*/dist packages/*/.turbo apps/*/.turbo apps/*/storybook-static .turbo $(PACK_DIR)

clean-all: clean ## clean + ลบ node_modules ทั้งหมด
	rm -rf node_modules packages/*/node_modules apps/*/node_modules
