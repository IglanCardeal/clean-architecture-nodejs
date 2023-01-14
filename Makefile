.PHONY: up

.PHONY: logs

.PHONY: down

up:
	npm run build && docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f