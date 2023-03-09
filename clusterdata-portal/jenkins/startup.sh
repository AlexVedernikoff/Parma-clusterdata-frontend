#!/bin/bash

# Определяем файл логирования
today=$(date "+%Y-%m-%d");
test -d logs || mkdir -p logs
log_file="./logs/clusterdata-portal.$today.log"
error_log_file="./logs/clusterdata-portal.err.$today.log"

# Запускаем процесс
nohup node index.js 1>${log_file} 2>${error_log_file} &


# Сохраняем идентификатор процесса
echo $! >> cluster-data-portal.pid

# Проверяем работу сервиса
attemps_count=0
attemps_max_count=3
sleep_interval=3

while [[ ${attemps_count} -le ${attemps_max_count} ]]
do
    ((attemps_count++))
    echo "Попытка проверки статуса сервиса $attemps_count..."

    # Делаем запрос
    code="$(curl -s -o /dev/null -w ''%{http_code}'' 127.0.0.1:8090)"

    # Обрабатываем успешное выполнение
    if [[ ${code} == "200" ]]
    then
        echo Сервис запущен.

        # Выводим информацию о запуске
        cat "$log_file"

        exit 0
    fi

    sleep ${sleep_interval}
done

echo "Сервис не запущен"

# Выводим информацию об ошибке
cat "$log_file"

# Выходим с неудачей выполнения сценария
exit 1
