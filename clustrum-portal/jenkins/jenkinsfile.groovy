#!/usr/bin/env groovy

/** Профиль сборки. Нужен для Jenkins */
env.PROFILE = 'dev'

/** Наименование ноды, на которой будет производиться сборка */
env.NODE_NAME = 'clusterdata-web.parmalogica.ru'

/** Адрес сервера */
env.SERVER_NAME = 'clusterdata-web.parmalogica.ru'

/** Имя пользователя, под которым заходим на удалённую машину по SSH */
env.USER_NAME = 'clustrum'

/** Пароль пользователя для входа на сервер по SSH */
env.SSH_PASSWORD = "dZU-8Nw-YMS-sDM"

/** Наименование сервиса (будет использоваться для наименования папок и файлов) */
env.SERVICE_NAME = 'clustrum-portal'
env.PARMA_UI_CORE = 'kamatech-ui-core'
env.PARMA_UI_REACT = 'kamatech-ui-react'

node("${env.NODE_NAME}") {
  /**
   * Забираем проект из git-репозитория
   */
  stage("Checkout from branch \"${env.BRANCH}\"") {
    checkout scm
  }

  /**
   * Устанавливаем пакеты
   */
  stage('Install packages') {
    sh "cd ${env.SERVICE_NAME} && npm install --loglevel info --no-audit --legacy-peer-deps"
    sh "cd ${env.PARMA_UI_CORE} && npm install --loglevel info --no-audit --legacy-peer-deps"
    sh "cd ${env.PARMA_UI_REACT} && npm install --loglevel info --no-audit --legacy-peer-deps"
  }

  /**
  * Запускаем тесты
  */
  stage('Run tests') {
    sh "cd ${env.SERVICE_NAME} && npm run test"
  }

  /**
   * Собираем и упаковываем проект
   */
  stage('Package project') {
    sh "cd ${env.SERVICE_NAME} && npm run build:dev"

    sh "cp ${env.SERVICE_NAME}/jenkins/*.sh ${env.SERVICE_NAME}/dist"
    sh "chmod +x ${env.SERVICE_NAME}/dist/*.sh"

    sh "cp ${env.SERVICE_NAME}/package.json ${env.SERVICE_NAME}/dist"
    sh "cp ${env.SERVICE_NAME}/.npmrc ${env.SERVICE_NAME}/dist"
  }

//  /**
//   * Если запущено не с ветки "master", то с успехом выходим из pipeline
//   */
//  if (env.BRANCH != 'origin/master') {
//    currentBuild.result = 'SUCCESS'
//    return
//  }

  // Далее все действия выполняем только для ветки "master"

  /**
   * Создаём архив со сборкой
   */
  stage('Zip project') {
    sh "cd ${env.SERVICE_NAME}/dist && zip -r ${env.SERVICE_NAME}.zip ./"
  }

  /**
   * Копируем проект на сервер
   */
  stage("Copy project") {
    sh "sshpass -p \"${env.SSH_PASSWORD}\" scp -r ${env.SERVICE_NAME}/dist/${env.SERVICE_NAME}.zip ${env.USER_NAME}@${env.SERVER_NAME}:${env.SERVICE_NAME}.zip"
  }

  /**
   * Останавливаем процесс
   */
  stage('Shutdown process') {
    sh "sshpass -p \"${env.SSH_PASSWORD}\" ssh -o StrictHostKeyChecking=no ${env.USER_NAME}@${env.SERVER_NAME} \"" +
            " test -d \"~/${env.SERVICE_NAME}\" || cd ~/${env.SERVICE_NAME} || " +
            " test \"shutdown.sh\" || ./shutdown.sh; " +
            "\""
  }

  /**
   * Удаляем проект на сервере
   */
  stage("Clean project") {
    // Удаляем директорию на сервере
    sh "sshpass -p \"${env.SSH_PASSWORD}\" ssh -o StrictHostKeyChecking=no ${env.USER_NAME}@${env.SERVER_NAME} \"rm -rf /home/${env.USER_NAME}/${env.SERVICE_NAME}/* \""
  }

  /**
   * Распаковываем архив в текущей папке
   */
  stage("Unzip project") {
    // Удаляем директорию на сервере
    sh "sshpass -p \"${env.SSH_PASSWORD}\" ssh -o StrictHostKeyChecking=no ${env.USER_NAME}@${env.SERVER_NAME} \"cd /home/${env.USER_NAME}/ && unzip -o ${env.SERVICE_NAME}.zip -d ${env.SERVICE_NAME} && chmod +x **/*.sh \""
  }

  /**
   * Запускаем процесс
   */
  stage('Startup process') {
    sh "sshpass -p \"${env.SSH_PASSWORD}\" ssh -o StrictHostKeyChecking=no ${env.USER_NAME}@${env.SERVER_NAME} \"" +
            " cd ~/${env.SERVICE_NAME};" +
            " npm install --loglevel info --legacy-peer-deps --no-audit express ejs dotenv; " +
            " ./shutdown.sh; " +
            " ./startup.sh; " +
            "\""
  }
}
