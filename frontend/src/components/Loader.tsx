import './Loader.css'

function Loader() {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' , minHeight: '100%'}}>
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
}

export default Loader;