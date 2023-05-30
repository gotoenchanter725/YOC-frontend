import { useSelector } from "react-redux"
import Image from "next/image"

import loadingImage from "../../../public/images/loading.gif"

const LoadingComponent = () => {
    const [loading] = useSelector((state: any) => [state.uxuiData.loading])
    return (
        <div className={`fixed left-0 top-0 w-[100vw] h-[100vh] flex justify-around items-center transition-all bg-[#38375C] ${loading?"z-[201] visible opacity-50":"z-[-2] invisible opacity-0"}`}>
            {

                <Image className="!w-full !h-full"
                    width={500}
                    height={400}
                    src={loadingImage} alt="loading" />
            }
        </div>
    )
}

export default LoadingComponent;