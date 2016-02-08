module.exports = ()=> {
    var resizable = false;
    return {
        grab: (actor)=>resizable = actor,
        release(){
            resizable = false;
        },
        getActor: ()=>resizable,
        isResizing: ()=>!!resizable
    }
};
