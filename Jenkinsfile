pipeline {
    agent any

    environment {
        IMAGE_NAME = "nginx:latest"
        CONTAINER_NAME = "my-nginx"
        TEST_REPO = "https://github.com/zaifi07/selenium-testing.git"
    }

    stages {

        stage('Get Committer Email') {
            steps {
                script {

                    env.AUTHOR_EMAIL = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    echo "Committer Email: ${env.AUTHOR_EMAIL}"
                }
            }
        }

        stage('Pull Docker Image') {
            steps {
                sh "docker pull ${IMAGE_NAME}"
            }
        }

        stage('Run Website Container') {
            steps {

                script {

                    // Remove old container
                    sh "docker rm -f ${CONTAINER_NAME} || true"

                    // Run website
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 5000:5000 \
                        ${IMAGE_NAME}
                    """

                    // Wait for startup
                    sleep 15
                }
            }
        }

        stage('Clone Selenium Repo') {
            steps {

                script {

                    sh """
                        rm -rf selenium-testing

                        git clone ${TEST_REPO}
                    """
                }
            }
        }

        stage('Setup Python Environment') {
            steps {

                dir('selenium-testing') {

                    sh """
                        python3 -m venv venv

                        . venv/bin/activate

                        pip install -r requirements.txt

                        cp .env.example .env
                    """
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {

                dir('selenium-testing') {

                    script {

                        env.TEST_RESULTS = sh(
                            script: """
                                . venv/bin/activate

                                pytest
                            """,
                            returnStdout: true
                        ).trim()
                    }
                }
            }
        }
    }

    post {

        success {

            mail(
                to: "${env.AUTHOR_EMAIL}",
                subject: "Selenium Tests Passed - ${env.JOB_NAME}",
                body: """
Hello,

Your deployment and Selenium tests completed successfully.


=====================
TEST RESULTS
=====================

${env.TEST_RESULTS}
Regards,
Jenkins
"""
            )
        }

        failure {

            script {

                def failedLogs = currentBuild.rawBuild.getLog(200).join("\n")

                mail(
                    to: "${env.AUTHOR_EMAIL}",
                    subject: "Selenium Tests Failed - ${env.JOB_NAME}",
                    body: """
Hello,

Your pipeline FAILED.

=====================
LAST LOGS
=====================

${failedLogs}

=====================
BUILD URL
=====================

${env.BUILD_URL}

Regards,
Jenkins
"""
                )
            }
        }

        always {

            sh "docker rm -f ${CONTAINER_NAME} || true"
        }
    }
}
