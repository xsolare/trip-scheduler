
env_exam_copy(){
    if ! [[ -f $1".example" ]]; then
        echo "The .env.example was not found in $(dirname $1)"
        exit 1
    fi
    SERVICE_NAME=$(basename $(dirname $1))
    if [[ -f $1 ]]; then
        echo "use .env for ${SERVICE_NAME}"
    else
        echo "The .env for ${SERVICE_NAME} was not found"
        echo ".env.example will be used as .env"
        cp $1.example $1
    fi
}

env_exam_copy ./docker/server/.env
env_exam_copy ./docker/client/.env

docker-compose build
docker-compose up -d