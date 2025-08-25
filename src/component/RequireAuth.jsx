//複数ページ型APP用ログイン確認

import {Navigate} from 'react-router-dom';

function RequireAuth({user,children}) {
    //userがない場合はloginページに
    if(!user){
        return <Navigate to='/login'  replace/>
    }
    return children;
}

export default RequireAuth;