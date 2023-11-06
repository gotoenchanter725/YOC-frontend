import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleLoading from './SimpleLoading';
import NoData from './NoData';

type PropsType = {
    ptokenAddress?: string,
    setPtokenAddress?: (v: string) => void
};

const ProjectSelector: FC<PropsType> = ({ ptokenAddress, setPtokenAddress }) => {
    const [isShow, setShow] = useState(false);

    const [projects, projectLoading, projectError] = useSelector((state: any) => {
        return [
            state.trade.projects.data,
            state.trade.projects.loading,
            state.trade.projects.error,
        ]
    });

    const selectHandle = (project: any) => {
        setShow(false);
        if (setPtokenAddress) setPtokenAddress(project.ptokenAddress);
    };

    return <div className='relative flex items-center cursor-pointer p-2' onClick={() => { setShow(!isShow) }}>
        <div className=''>{"YTESTE"}</div>
        <img className="w-6 ml-1" src="/images/arrow-down.png" />

        {
            isShow ?
                <div className='w-[160px] max-h-[200px] absolute z-[10] -right-[140px] top-6 overflow-x-hidden overflow-y-auto bg-[#110f29] scrollbar scrollbar-w-1 scrollbar-thumb-[#FFFFFF33] scrollbar-track-[#FFFFFF33] p-1'>
                    {
                        projectLoading == 1 ? <div className='w-full h-full flex items-center justify-center'>
                            <SimpleLoading className='w-6 h-6' />
                        </div> : <>
                            {
                                projects.length ? <>
                                    {
                                        projects.map((item: any, index: number) => {
                                            return <div key={`project-select-${index}`} onClick={() => { selectHandle(item) }} className={`px-2 py-1 cursor-pointer ${index == 1 ? 'bg-[#03020a]' : 'bg-[#191733]'} hover:bg-[#03020a]`}>
                                                PROJECT A
                                            </div>
                                        })
                                    }
                                </> : <div className='w-full h-full flex items-center justify-center'>
                                    <NoData text='No Projects' />
                                </div>
                            }
                        </>
                    }
                </div>
                : <></>
        }
    </div>
}

export default ProjectSelector;