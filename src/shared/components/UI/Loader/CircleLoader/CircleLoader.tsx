
import '../loader.scss';

export const CircleLoader = () => {
    return (
        <div className='grid-loader'>
            <div className="lds-roller">
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
        </div>
    )
}