import React from 'react';

import Container from 'react-bootstrap/Container';

function App() {
    return (
        <div className="container py-3">
            <header>
                <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
                        <img src="/logo.svg" height="40px" width="40px" alt="Clock" />
                    </a>
                </div>
            </header>

            <main>
                <h1>Test</h1>
            </main>
        </div>
    );
}

export default App;
