export const  suggest = async (word:string) => {
    const result = await fetch(`https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${word}`)

    console.log(result)
}