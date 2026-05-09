pipeline {

    agent any

    environment {
        IMAGE_NAME = "zaifi07/trailtales"
        CONTAINER_NAME = "trail-tales"
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

                    // Remove old container if exists
                    sh "docker rm -f ${CONTAINER_NAME} || true"

                    // Run website container
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 5000:5000 \
                        ${IMAGE_NAME}
                    """

                    // Wait for website startup
                    sleep 15
                }
            }
        }

        stage('Check Website') {
            steps {

                script {

                    env.APP_STATUS = sh(
                        script: """
                            if curl -I http://15.207.26.84:5000; then
                                echo "Website is RUNNING"
                            else
                                echo "Website is DOWN"
                            fi
                        """,
                        returnStdout: true
                    ).trim()

                    echo env.APP_STATUS
                }
            }
        }

        stage('Clone Selenium Repo') {
            steps {

                sh """
                    rm -rf selenium-testing

                    git clone ${TEST_REPO}
                """
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

                                pytest || true
                            """,
                            returnStdout: true
                        ).trim()

                        echo env.TEST_RESULTS
                    }
                }
            }
        }
    }

    post {

        success {

            mail(
                to: "${env.AUTHOR_EMAIL}",
                subject: "Jenkins Pipeline SUCCESS - ${env.JOB_NAME}",
                body: """
Hello,

Your deployment and Selenium tests completed successfully.


====================================
SELENIUM TEST RESULTS
====================================

${env.TEST_RESULTS}



Regards,
Jenkins
"""
            )
        }

        failure {

            mail(
                to: "${env.AUTHOR_EMAIL}",
                subject: "Jenkins Pipeline FAILED - ${env.JOB_NAME}",
                body: """
Hello,

Your Jenkins pipeline FAILED.

====================================
JOB NAME
====================================

${env.JOB_NAME}

====================================
BUILD NUMBER
====================================

${env.BUILD_NUMBER}

====================================
BUILD URL
====================================

${env.BUILD_URL}

Please check Jenkins console logs.

Regards,
Jenkins
"""
            )
        }

        always {

            script {

                // Cleanup selenium repo
                sh "rm -rf selenium-testing || true"
            }
        }
    }
}
