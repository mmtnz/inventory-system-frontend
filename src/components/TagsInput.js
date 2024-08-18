import React from "react";

const TagsInput = ({tagList, setTagList}) => {

    const tagRef = React.createRef();
    
    const addTag = (e) => {
        e.preventDefault();
        setTagList([...tagList, tagRef.current.value])
        tagRef.current.value = ''
    };

    function removeTag(index){
        setTagList(tagList.filter((el, i) => i !== index))
    }

    return(
        <div className="tags-input-container">
            {tagList.length > 0 && 
                <div className="tags-container">
                    {tagList.map((tag, index) => (
                        <div className="tag-item" key={index}>
                            <span className='tag'>{tag}</span>
                            {/* <span className="close" onClick={() => removeTag(index)}>&times;</span> */}
                            <div role="button" className="close-button" onClick={() => removeTag(index)}>
                                <svg 
                                    className='close'
                                    height="14px"
                                    width="14px"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                    focusable="false">
                                    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            }

            <input type="text" ref={tagRef}/>
            
            <div className="button-container">
                <button onClick={addTag}>Agregar</button>
            </div>
          
        </div>
    );
};
export default TagsInput;  