module.exports = {
    apps: [{
        name: 'vpnp-iceSpeech',
        script: 'NODE_ENV=production node dist/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        error_file: './api-log/vpvp-speech.stderr.log',
        out_file: './api-log/vpvp-speech.stdout.log',
        log: './api-log/vpvp-speech.stdout.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }],
}