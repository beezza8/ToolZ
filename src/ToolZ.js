const os = require('os')
const shell = require("shelljs")

class IO {
    constructor(ver, owner, admins) {
        this.ver = ver
        this.owner = owner
        this.admins = admins
    }
    IOWarn() {
        console.log("WARNED by IO.IOWarn")
    }
    ShowVersion() {
        console.log(this.ver)
    }
    GetUserInfo() {
        os.platform()
    }
}


const input = require("input")
const fs = require("fs")

let cmd
let version = "1.0.0-BETA"
const io = new IO(version, "Beezza", "[]")

function writelog() {

}


(async() => {
    if (!fs.existsSync("ToolZ-user.bez")) {
        console.log("- - # # 初回セットアップ # # - -")
        console.log("設定ファイルを生成しています...")
        const data = `
        {
          "AnonymousMode" : false,
          "PasswordProtection" : false,
          "password" : "none"
        }`
        fs.appendFileSync("ToolZ-config.json", data)

        let uname = await input.text("ユーザー名 : ")
        if (uname === "") {
            uname = "User"
            console.log("ユーザー名が入力されなかったため初期値の'User'が当てはめられました")
        }
        fs.appendFileSync("ToolZ-user.bez", uname + ":")
        console.log("- - # # # # # # # # - -")
    }

    await console.log(`
    ###########################################################
    ###########################################################
    ###                                                     ###
    ###             Welcome to ToolZ(${version})            ###
    ###                                                     ###
    ###########################################################
    ###########################################################`)

    const config = require("./ToolZ-config.json")
    await console.log('"exit"と入力して終了')
    const cmd_list = ["exit", "reset", "test", "touch", "version", "cat", "help", "cjson", "date", "docs"]
    while (true) {
        const user = fs.readFileSync("ToolZ-user.bez", "utf8").split(":")[0]
        if (config.PasswordProtection) {
            console.log("パスワード保護が有効なためパスワードを入力してください")
            const passwd = await input.text("Password :")
            if (passwd != config.password) {
                console.log("パスワードが間違っているため3秒後に自動で終了します")
                setTimeout(() => {
                    process.exit(0)
                }, 3000)
            }else {

            }
        }
        if (config.AnonymousMode) {
            console.log("匿名モードでログインします")
            cmd = await input.text("Anonymous@localhost : $")
        }else {
            cmd = await input.text(user + "@localhost: $")
        }
        switch (cmd) {
            case "exit":
                console.log("正常に終了しました")
                writelog()
                return
            case "test":
                console.log("テスト完了")
                writelog()
                break
            case "touch":
                const fname = await input.text("作成するファイル名を入力してください :")
                if (fs.existsSync(fname)) {
                    console.log("すでに同じファイル名のファイルが存在しています！")
                    writelog()
                    break
                }else {
                    fs.writeFileSync(fname, "")
                    writelog()
                    break
                }
            case "version":
            case "v":
                console.log(version)
                writelog()
                break
            case "reset":
                writelog()
                const ans = await input.text("本当にリセットしますか？[y(Yes), n(No)] :")
                if (ans === "y" || ans === "Yes" || ans === "yes") {
                    fs.unlinkSync("ToolZ-user.bez")
                    console.log("正常にリッセットしました！")
                    return
                }else {
                    console.log("y(yes)以外が入力されたため中断しました")
                    break
                }
            case "warn":
                io.IOWarn()
                break
            case "cat":
                const cat_path = await input.text("対象ファイル名 :")
                if (!fs.existsSync(cat_path)) {
                    console.log("そのようなファイルは存在しません")
                    break
                }
                if (cat_path.endsWith(".exe") || cat_path.endsWith(".bin")) {
                    console.log("バイナリファイルはクラシュのもとになるため出力できませんでした")
                    break
                }
                const cat_data = fs.readFileSync(cat_path, "utf-8")

                console.log("####################################################################################")
                console.log(cat_data)
                console.log("####################################################################################")
                break
            case "help":
                console.log("-- すべてのコマンド --")
                for(let i = 0; i < cmd_list.length; i++) {
                    console.log(cmd_list[i])
                }
                break
            case "date":
                const date = new Date()
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const DATE = date.getDate()
                const hour = date.getHours()
                const minute = date.getMinutes()
                console.log(`${year}年 ${month}月 ${DATE}日 ${hour}時間 ${minute}分`)
                break
            case "cjson":
                const cjson_fname = await input.text("ファイル名 :")
                if (fs.existsSync(cjson_fname)) {
                    console.log(cjson_fname + "はすでに存在しています")
                    break
                }
                const cjson_key = await input.text("キー :")
                const cjson_value = await input.text("バリュー :")
                fs.appendFileSync(cjson_fname, `{"${cjson_key}" : "${cjson_value}"}`)
                break
            case "site":
                console.log("Our website is https://beezza8.github.io/ToolZ/")
                break
            case "download":
                if (!shell.which("git")) {
                    console.log("gitがインストールされてないため続行できませんでした\nhttps://github.com/beezza8/ToolZ より手動でダウンロードしてください")
                    break
                }
                console.log("githubから新しいバージョンをダウンロードしています...")
                shell.exec("git clone https://github.com/beezza8/ToolZ")
                console.log("最新のバージョンを" + __dirname + "/ToolZにダウンロードしました")
                break
            case "see":
                const seeAns = await input.text("URL :")
                const res = seeAns.startsWith("http") ? fetch(seeAns).text : "URLが正しく入力されませんでした"
                console.log(res)
                break
            default:
                console.log(`コマンド "${cmd}" が見つかりませんでした`)
        }
    }
})()