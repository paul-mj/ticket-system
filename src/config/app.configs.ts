import { MasterId } from "../common/database/enums";

class AppConfigs{
    static newButtonDisabledMastersITC = [
        MasterId.UserCreationRequest,
        MasterId.UserModificationRequest,
        MasterId.UserAdditonal,
        MasterId.UserRemovalRequest,
        MasterId.Requests
    ]
    static newButtonDisabledMastersFranchise = [
        MasterId.Resolutions,
        MasterId.Circulars,
        MasterId.Announcements,
        MasterId.Meetings,
        MasterId.Events,
        MasterId.NoticeBoardDesign
    ]
}
export default AppConfigs;