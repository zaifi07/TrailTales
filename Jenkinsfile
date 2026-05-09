pipeline {
    agent any

    environment {
        IMAGE_NAME = "zaifi07/trailtales"
        CONTAINER_NAME = "trail-tales"
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

        stage('Run Container') {
            steps {

                script {

                    // Remove old container if exists
                    sh """
                        docker rm -f ${CONTAINER_NAME} || true
                    """

                    // Run container
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 5000:5000 \
                        ${IMAGE_NAME}
                    """

                    // Wait for container startup
                    sleep 10
                }
            }
        }

        stage('Check Container') {
            steps {

                script {

                    def containerStatus = sh(
                        script: "docker ps",
                        returnStdout: true
                    ).trim()

                    def appStatus = sh(
                        script: '''
                            if curl -I http://15.207.26.84:5000; then
                                echo "Application is RUNNING"
                            else
                                echo "Application is DOWN"
                            fi
                        ''',
                        returnStdout: true
                    ).trim()

                    env.CONTAINER_STATUS = containerStatus
                    env.APP_STATUS = appStatus
                }
            }
        }
    }

    post {

        success {

            mail(
                to: "${env.AUTHOR_EMAIL}",
                subject: "Docker Deployment Success - ${env.JOB_NAME}",
                body: """
Hello,

Your Docker image was deployed successfully.

=====================
IMAGE
=====================

${IMAGE_NAME}

=====================
APPLICATION STATUS
=====================

${env.APP_STATUS}

=====================
RUNNING CONTAINERS
=====================

${env.CONTAINER_STATUS}

Build URL:
${env.BUILD_URL}

Regards,
Jenkins
"""
            )
        }

        failure {

            mail(
                to: "${env.AUTHOR_EMAIL}",
                subject: "Docker Deployment Failed - ${env.JOB_NAME}",
                body: """
Hello,

Your deployment pipeline FAILED.

Check Jenkins logs here:
${env.BUILD_URL}

Regards,
Jenkins
"""
            )
        }
    }
}
