//複数ページ型APP用共通部分

import {Outlet, Link} from 'react-router-dom';
import './pages/Layout.css';

function Layout({user}){
    return(
        <div>
            <header>
            <h1>履修登録システム</h1>
                <nav>
                    <Link to='/lessons'>履修登録</Link>
                    <Link to='/timetable'>時間割確認</Link>
                    <Link to='/syllabus'>シラバス検索</Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}


export default Layout;