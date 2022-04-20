import Header from './Header';
import Create from './Create';

let styles = {
    create: {
        
    },
    sel: {
        width:"100%",
        height:300
    }
}

function App() {
    return (
    <div className="container-fluid d-flex flex-column border border-success">
        <Header />
        <div className="flex-grow-1" style={styles.create}>
            <Create  />
        </div>     
    </div>        
    );
}

export default App;
