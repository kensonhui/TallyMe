interface PropsType {
    item: string;
    changeCheck: (e:any) => void;
    checked: boolean;
}
export function CheckBox(props:PropsType) {
    return(
        <>
            <input type="checkbox" checked={props.checked} name={props.item} onChange={props.changeCheck}/>
            <label className="">{props.item}</label>
        </>
    )
}