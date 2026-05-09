pipeline {
    agent any

    stages {

        stage('Run Commands') {
            steps {

                script {

                    // Capture command outputs
                    def dockerStatus = sh(
                        script: "docker ps",
                        returnStdout: true
                    ).trim()

                    def currentDate = sh(
                        script: "date",
                        returnStdout: true
                    ).trim()

                    def appStatus = sh(
                        script: "curl -I http://localhost:3000",
                        returnStdout: true
                    ).trim()

                    // Get latest committer email
                    def authorEmail = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    // Send selected outputs only
                    mail(
                        to: authorEmail,
                        subject: "Deployment Report",
                        body: """
Hello,

Deployment completed successfully.

Date:
${currentDate}

=====================
DOCKER CONTAINERS
=====================

${dockerStatus}

=====================
APP STATUS
=====================

${appStatus}

Regards,
Jenkins
"""
                    )
                }
            }
        }
    }
}
