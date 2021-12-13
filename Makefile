.PHONY: remove_containers
remove_containers:
	-docker stop $$(docker ps -aq)
	-docker rm $$(docker ps -aq)

.PHONY: armageddon
armageddon:
	-make remove_containers
	-docker builder prune -f
	-docker network prune -f
	-docker volume rm $$(docker volume ls --filter dangling=true -q)
	-docker rmi $$(docker images -a -q) -f

.PHONY: docker_run
docker_run:
	-sudo docker-compose up

.PHONY: docker_stop
docker_stop:
	-sudo docker stop api_db bmstu_web