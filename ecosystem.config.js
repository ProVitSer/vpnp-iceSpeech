module.exports = {
    apps: [{
        name: 'vpnp-iceSpeech',
        script: 'dist/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
    }],
}