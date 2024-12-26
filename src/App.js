import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Post from './pages/Post';
import NewPost from './pages/NewPost';
import EditPost from "./pages/EditPost";
import Login from "./pages/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import SignUp from "./pages/SignUp";
import {Logout} from "./pages/Logout";
import MyAccount from "./pages/MyAccount";


function App() {
    return (
        <Router>
            <div className="App">
                <Navigation/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/post/:id" element={<Post/>}/>
                    <Route path="/new-post" element={<NewPost/>}/>
                    <Route path="/edit-post/:id" element={<EditPost/>}/>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    <Route path="/logout" element={<Logout/>} />
                    <Route path="/myaccount" element={<MyAccount/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;