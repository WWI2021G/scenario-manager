FROM ubuntu:latest
LABEL authors="novak"

ENTRYPOINT ["top", "-b"]