pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'

                script {
                    def authorEmail = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    echo "The committer's email is: ${authorEmail}"
                }
            }
        }
    }
}
