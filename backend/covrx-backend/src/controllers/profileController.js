class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }

    async getProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in the request after authentication
            const profile = await this.profileService.getProfileById(userId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in the request after authentication
            const updatedProfile = await this.profileService.updateProfile(userId, req.body);
            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

export default ProfileController;