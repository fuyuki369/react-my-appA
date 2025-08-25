import {useState} from 'react';
import './SyllabusSearch.css';

function SyllabusSearch() {
    const [semester,setSemester] = useState('');   //学期state
    const [faculty,setFaculty] = useState('');     //学部state
    const [day,setDay] = useState('');             //曜日state
    const [period,setPeriod] = useState('');        //時限state
    const [keyword,setKeyword] = useState('');      //キーワード入力state

    const [searchResults,setSearchResults] = useState([]); //検索結果の帰り値state
    const [clickedLesson,setClickedLesson] = useState(null); //モーダル表示切り替えstate

    //検索ボタンの処理
    const handleSearch = async() => {
        const searchParams = {
            semester: semester,  //const semester = 'semesterの値'
            faculty: faculty,
            day: day,
            period: period,
            keyword: keyword,
        }
        console.log("検索条件:",searchParams);

        //API送信処理
        try{
            const response = await fetch ('http://localhost:3000/api/lessons',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(searchParams),
            })
            const data = await response.json();

            if(!response.ok){
                throw new Error("サーバーエラー")
            }

            //帰り値処理
            console.log("検索結果:",data)
            setSearchResults(data)  

        }catch(error){
            console.error("検索エラー:", error)
        }
    }

    return(
        <div className="Syllabus-container">
            {/*学期*/}
            <div className="semester">
                <label>学期:</label>
                <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="前期">前期</option>
                    <option value="後期">後期</option>
                </select>
            </div>
            {/*学部*/}
            <div className="faculty">
                <label>学部:</label>
                <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="文学部">文学部</option>
                    <option value="工学部">工学部</option>
                    <option value="経済学部">経済学部</option>
                </select>
            </div>
            {/*曜日*/}
            <div className="day">
                <label>曜日:</label>
                <select value={day} onChange={(e) => setDay(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="月">月</option>
                    <option value="火">火</option>
                    <option value="水">水</option>
                    <option value="木">木</option>
                    <option value="金">金</option>
                </select>
            </div>
            {/*時限*/}
            <div className="period">
                <label>時限:</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            {/*キーワード入力*/}
            <div className="keyword">
                <input
                    type="text" 
                    value={keyword}
                    placeholder='授業名や教員名を入力'
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
            {/*検索ボタン*/}
            <div className="search-button">
                <button onClick={handleSearch}>検索</button>
            </div>

            {/*検索結果表示*/}
            {searchResults.length === 0 ? (
                <p>該当する授業がありません</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>授業名</th>
                            <th>曜日</th>
                            <th>時限</th>
                            <th>概要</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((sResult) => (
                            <tr key={sResult.id} onClick={() => setClickedLesson(sResult)}>  {/*idで特定のkeyをする、setをsResultにして特定のsearchResultsを受け取る*/}
                                <td>{sResult.name}</td>
                                <td>{sResult.day}</td>
                                <td>{sResult.period}</td>
                                <td>{sResult.summary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/*モーダル表示*/}
            {clickedLesson && (   //trueの時(nullではない場合)に実行する
                <div className="modal-overlay" onClick={() => setClickedLesson(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>  {/*e.stopPropagationは親要素にだけ届く*/}
                        <h2>{clickedLesson.name}</h2>
                        <p>曜日: {clickedLesson.day}</p>
                        <p>時限: {clickedLesson.period}</p>
                        <p>概要: {clickedLesson.summary}</p>
                        <button onClick={() => setClickedLesson(null)}>閉じる</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SyllabusSearch;