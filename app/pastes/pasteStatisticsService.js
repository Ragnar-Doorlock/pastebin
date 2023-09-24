class PasteStatisticsService {
    cunstructor(pasteRepository) {
        this.pasteRepository = pasteRepository;
    }

    async increaseViews(pasteId) {
        // pastRepo == undefined
        await this.pasteRepository.updateViews(pasteId);
    }
}

module.exports = PasteStatisticsService;
