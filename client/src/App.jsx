import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './auth';
import Feed from './pages/Feed';
import Auth from './pages/Auth';
import Post from './pages/Post';
import Detail from './pages/Detail';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav>
        <Link to="/" className="brand">CampusDebrief</Link>
        <div>
          {user ? (
            <>
              <Link to="/post">Share experience</Link>
              <button onClick={logout}>Logout ({user.name})</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/post" element={user ? <Post /> : <Navigate to="/login" />} />
          <Route path="/experience/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}
