FROM registry.gitlab.com/av1o/base-images/python:3.10

RUN mkdir -p /home/somebody/build
WORKDIR /home/somebody/build

# install dependencies
COPY requirements.txt requirements.txt
RUN pip install --user -r requirements.txt

COPY main.py .

ENTRYPOINT ["flask", "--app", "main", "run"]
CMD ["--host=0.0.0.0", "--port", "8080"]
