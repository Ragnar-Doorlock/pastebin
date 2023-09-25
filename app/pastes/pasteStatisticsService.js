class PasteStatisticsService {
    constructor(pasteRepository) {
        this.pasteRepository = pasteRepository;
    }

    async increaseViews(pasteId) {
        await this.pasteRepository.updateViews(pasteId);
    }
}

module.exports = PasteStatisticsService;
