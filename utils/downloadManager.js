class DownloadManager {
    constructor() {
        this.downloads = {};

        setInterval(() => {
            for (const projectId in this.downloads) {
                for (const ip in this.downloads[projectId]) {
                    if (Date.now() - this.downloads[projectId][ip] > 5 * 60 * 1000) {
                        delete this.downloads[projectId][ip];
                    }
                }
            }
        }, 1000 * 60);
    }

    addDownload(projectId, ip) {
        if (!this.downloads[projectId]) {
            this.downloads[projectId] = {};
        }

        this.downloads[projectId][ip] = Date.now();
    }

    checkDownloaded(projectId, ip) {
        if (!this.downloads[projectId]) {
            return false;
        }

        return this.downloads[projectId][ip];
    }
}

module.exports = DownloadManager;