
let header = {

    render: async () => {
        let view =  /*html*/`
        <div id='header'>
        <a onClick="checklog()" href="#"><h1>FaceNote</h1></a>
        <a href="/users"><h3>Find User</h3></a>
        <a href="#" id="show-friends"><h3>My Friends</h3></a>
        <a href="#" onclick="logOut()"><h3>Logout</h3></a>
        </div>`
        return view
    },
    after_render: () => {

    }
}