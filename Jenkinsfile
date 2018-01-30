pipeline {
  agent any
  stages {
    stage('NPM Install') {
      steps {
        powershell 'npm install'
      }
    }
    stage('Build and Test') {
      steps {
        powershell 'npm test'
      }
    }
    stage('Build Docs') {
      steps {
        powershell 'npm run docs'
      }
    }
  }
}