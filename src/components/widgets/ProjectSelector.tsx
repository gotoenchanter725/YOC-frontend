import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SimpleLoading from './SimpleLoading';
import NoData from './NoData';

type PropsType = {
    ptokenAddress?: string,
    setPtokenAddress?: (v: string) => void,
    exceptAddress?: string
};

const ProjectSelector: FC<PropsType> = ({ ptokenAddress, setPtokenAddress, exceptAddress }) => {
    const [isShow, setShow] = useState(false);
    const [projectDetail, setProjectDetail] = useState<any>({})

    const [projects, projectLoading, projectError] = useSelector((state: any) => {
        return [
            state.trade.projects.data,
            state.trade.projects.loading,
            state.trade.projects.error,
        ]
    });

    useEffect(() => {
        if (ptokenAddress && projects.length) {
            const detail = projects.find((item: any) => item.data.ptokenAddress == ptokenAddress);
            setProjectDetail(detail);
        }
    }, [ptokenAddress, projects])

    const selectHandle = (project: any) => {
        setShow(false);
        if (setPtokenAddress) setPtokenAddress(project.data.ptokenAddress);
    };

    const addPtokenHandle = async (insertedAddress: string, insertedSymbol: string, insertedDecimals: number, event: React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: insertedAddress, // The address that the token is at.
                    symbol: insertedSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: insertedDecimals, // The number of decimals in the token
                    // image: 'https://otaris.io/png/otaris_logo.png', // A string url of the token logo
                },
            },
        });
    }

    return <div className='relative flex items-center cursor-pointer p-2 pr-6' onClick={() => { setShow(!isShow) }}>
        <div className='flex items-center text-center relative ml-7'>
            {
                (projectDetail && projectDetail.data) ?
                    <img
                        className='w-5 h-5 mr-2 block -left-6 absolute'
                        src={(projectDetail && projectDetail.data) ? projectDetail.data.iconUrl : ""}
                        alt='project'
                        onClick={(e) => addPtokenHandle(projectDetail.data.ptokenAddress, projectDetail.data.ptokenSymbol, projectDetail.data.ptokenDecimals, e)}
                    />
                    : ""
            }
            <div className='whitespace-nowrap'>{(projectDetail && projectDetail.data) ? projectDetail.data.projectTitle : ""}</div>
        </div>
        <img className="w-6 ml-1" src="/images/arrow-down.png" />

        {
            isShow ?
                <div className='max-h-[380px] absolute z-[10] right-[0px] top-10 overflow-x-hidden overflow-y-auto bg-[#110f29] scrollbar scrollbar-w-1 scrollbar-thumb-[#FFFFFF33] scrollbar-track-[#FFFFFF33] p-1'>
                    {
                        projectLoading == 1 ? <div className='w-full h-full flex items-center justify-center'>
                            <SimpleLoading className='w-6 h-6' />
                        </div> : <>
                            {
                                projects.length ? <>
                                    {
                                        projects.filter((item: any) => exceptAddress ? item.data.ptokenAddress != exceptAddress : true).map((item: any, index: number) => {
                                            return <div
                                                key={`project-select-${index}`}
                                                onClick={() => { selectHandle(item) }}
                                                className={`relative flex items-center py-1 pl-7 pr-2 cursor-pointer ${ptokenAddress == item.data.ptokenAddress ? 'bg-[#03020a]' : 'bg-[#191733]'} hover:bg-[#03020a]`}
                                            >
                                                <img
                                                    className='w-5 h-5 left-1 absolute'
                                                    src={item.data.iconUrl}
                                                    alt='project'
                                                    onClick={(e) => addPtokenHandle(item.data.ptokenAddress, item.data.ptokenSymbol, item.data.ptokenDecimals, e)}
                                                />
                                                <span className='whitespace-nowrap'>
                                                    {item.data.projectTitle}
                                                </span>
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