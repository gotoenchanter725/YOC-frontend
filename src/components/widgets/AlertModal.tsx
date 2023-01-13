import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import Modal from "./Modalv2";
import alertSuccessImage from "../../../public/images/success.png";
import alertErrorImage from "../../../public/images/error.png";

import { alert_hidden } from "../../../store/actions";

const AlertModal = () => {
    const hiddenAlertModal = () => {
        dispatch(alert_hidden() as any);
    }

    const dispatch = useDispatch();
    const { alertModal, alertType, alertContent } = useSelector((state: any) => state.uxuiData);

    return (
        <Modal size='small' show={alertModal} onClose={() => hiddenAlertModal()}>
            <div className='w-full flex flex-col justify-around items-center py-8 px-6'>
                {
                    alertType == "success" ?
                        <Image width={50} height={52} src={alertSuccessImage} alt='image' />
                        :
                        <Image width={50} height={52} src={alertErrorImage} alt='image' />
                }
                <p className='text-center text-lg w-full text-white pt-4 font-semibold'>{alertContent}</p>
            </div>
        </Modal>
    )
}

export default AlertModal;