import { useState } from 'react'
import './login.css'

function Login({setUser}) {    
    const [email,setEmail] = useState('');  //メールアドレスstate
    const [password,setPassword] = useState('');  //パスワードstate
    const [loginResult,setLoginResult] = useState('');  //リザルトstate

    const handleLogin = async(e) => {
        e.preventDefault();

        try{
            const queryParams = new URLSearchParams({
                'session[email]': email,
                'session[password]': password
            });
    
            const response = await fetch(`http://localhost:3000/api/admin/login?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            

            if(response.ok){
                const data = await response.json(); 
                setLoginResult('ログイン成功!');
                console.log('トークン:',date.token); 
                setUser({ //サーバーが返すもの
                    id: data_id,
                    name: data_name,
                    token: data_token,
                })
            }else{
                setLoginResult('IDまたはパスワードが正しくありません。')
            }
        } catch(error) {
        console.error('通信エラー',error)
        setLoginResult('通信エラーが発生しました。')
        }
    }

    return (
        <>
            <div className='login-container'>
                <form onSubmit={handleLogin}>
                    <h1>ログインフォーム</h1>
                    <hr />
                    <div className="uiForm">
                        <div className='formField'>
                            <label htmlFor="学籍番号">学籍番号</label>
                            <input 
                                name='email'
                                type="email" 
                                placeholder='学籍番号(@example.com)'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="パスワード">パスワード</label>
                            <input
                                name='password'
                                type="password" 
                                placeholder='パスワード'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className='login-btn' type='submit'>ログイン</button>
                    </div>
                </form>
                <p>{loginResult}</p>
            </div>
        </>
    )
}

export default Login;
