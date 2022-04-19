import Header from './Header';
import Create from './Create';

let styles = {
    header: {
        backgroundColor:'green',
        fontSize: 25
    }, 
    create: {
        backgroundColor:'red'
    }
}

function App() {
    return (
    <div className="container-fluid d-flex flex-column">
        <div style={styles.header}>
            <Header />
        </div>
        <div className="flex-grow-1" style={styles.create}>
            <Create  />
        </div>        
    </div>        
    );
}

export default App;
