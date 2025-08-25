import { useState } from "react";
import './Login.css'

function Login4({setUser}){
    const [email,setEmail] = useState(''); //学籍番号state
    const [password,setPassword] = useState(''); //パスワードstate
    const [loginResult,setLoginResult] = useState('') //リザルトstate

    //ログインボタン処理
    const handleLogin = async(e) => {
        e.preventDefault();

        //API送信処理
        try{
            const queryParams = new URLSearchParams({
                'session[email]': email,
                'session[password]': password,
            });
            
            const response = await fetch (`http://localhost:3000/api/admin/login?${queryParams}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();

            if(!response.ok){
                setLoginResult('IDまたはパスワードが正しくありません。')
                console.log('IDまたはパスワードが正しくありません。')
                return;
            }

            //ログイン成功時処理
            setLoginResult('ログイン成功');
            setUser({
                id: data_id,
                name: data_name,
                token: data_token,
            })
            console.log('トークン:',date.token); 

        }catch(error){
            console.error('通信エラー',error);
            setLoginResult('通信エラーが発生しました')
        }
    }

    return(
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h1>ログインフォーム</h1>
                <hr /> {/*見出し下線*/}
                <div className="inFrom">
                    <div className="formField">
                        {/*学籍番号入力*/}
                        <label htmlFor="学籍番号">学籍番号</label>
                        <input 
                            name="email"
                            type="email"
                            placeholder="学籍番号(@example.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/*パスワード入力*/}
                        <label htmlFor="パスワード">パスワード</label>
                        <input
                            name="password"
                            type="password" 
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="login-btn" type="submit">ログイン</button>
                </div>
            </form>
            <p>{loginResult}</p>
        </div>
    )
}

export default Login4;