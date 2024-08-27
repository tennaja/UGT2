import { useEffect, useState } from 'react';

const Select = (props) => {

    const {withNullValue=false , defaultValue=null,onChangeInput,type = 1, register, label,validate,disabled, error, id, options = [], valueProp, displayProp, placeholder = 'Please Select', isHaveBorder = true, ...inputProps } = props
    // const withWhiteSpaceOp = [{ [valueProp]: null, [displayProp]: ' ' }, ...options]
    const withNullOptions = [{ [valueProp]: null, [displayProp]: placeholder }, ...options]
    const newOptions = withNullValue ? withNullOptions: options
    const [isSelected, setIsSelected] = useState(false)
    // const [value, setValue] = useState(inputProps.value)
    useEffect(()=>{
        if(defaultValue){

            onChangeInput&&onChangeInput(defaultValue)
            inputProps.onChange&&inputProps.onChange(defaultValue)
            setIsSelected(true)
        }
      
        
    },[])
    const setTextSelectColor = () =>{
        if (defaultValue || inputProps.value) {
            return 'black'
        }   
        else{ 
            
            return '#d1d5db'
        }
    }
    const renderSelect = () => {
        if (type === 1) {
            return <>
                {label ? (<label className='mb-1' htmlFor={id}><b>{label}<font className='text-[#f94a4a]'>{validate}</font></b></label>) : (<></>)}
                <select
                    {...inputProps}
                    id={id}
                    style={{ color: setTextSelectColor()  }} //
                    // value={1}
                    disabled={disabled ? true  : false}
                    className={`p-4 cursor-pointer	 select ${error ? 'border-1 border-rose-500 rounded block w-full bg-transparent outline-none py-2 px-3'
                        :
                        'focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-2 px-3'}`
                    }
                    onChange={(e) => {
                        setIsSelected(true)

                        const selectedValue = options.filter(item=>item[valueProp] == e.target.value)
                        
                        if(selectedValue.length>0){
                            onChangeInput&&onChangeInput(selectedValue[0])
                            inputProps.onChange&&inputProps.onChange(e.target.value)
                        }else{
                            onChangeInput&&onChangeInput(null)
                            inputProps.onChange&&inputProps.onChange(null)
                        }
        
                        
                    }}


                >
                    
                    {(!defaultValue ) && <option value={null} selected disabled hidden>
                        <span className='cursor-pointer'>{placeholder}</span>
                    </option>}
                    {newOptions.map((option, index) => {

                        if(option[valueProp] === null){ //withNullValue Props
                            return <option key={index}
                            value={null} 
                            hidden
                            >
                            {option[displayProp]}
                        </option>
                        }
                        else{
                            return <option key={index}
                            // key={option[valueProp]} 
                            value={option[valueProp]} 
                            className='text-black'>

                            {option[displayProp]}

                        </option>
                        }
                     
                    })}
                </select>
                {error && (
                    <p className="mt-1 mb-1 text-red-500 text-xs text-left">
                        {error.message}
                    </p>
                )}
            </>
        } else {
            //TYPE2
            return <> {label ? (<label className='mb-1' htmlFor={id}>{label}</label>) : (<></>)}
                <select
                    {...inputProps}
                    id={id}
                    style={{ color:'black' }}
                    // value={value}
                    className={`font-extrabold focus:outline-none p-4 cursor-pointer select2 ${error ? 'border-1 border-rose-500 rounded block w-full bg-transparent outline-none py-2 px-3'
                        :
                        'focus:outline-none	  border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-2 px-3'}`
                    }
                    onChange={(e) => {
                        setIsSelected(true)
                        const selectedValue = options.filter(item=>item[valueProp] == e.target.value)
                        
                        if(selectedValue.length>0){
                            onChangeInput&&onChangeInput(selectedValue[0])
                            inputProps.onChange&&inputProps.onChange(e.target.value)
                        }else{
                            onChangeInput&&onChangeInput(null)
                            inputProps.onChange&&inputProps.onChange(null)
                        }
                      
                    }}


                >
        
                    {!defaultValue && <option value={null} selected disabled hidden>
                        <span className='cursor-pointer'><b>{placeholder}</b></span>
                    </option>}
                    {newOptions.map((option, index) => {

                        return <option 
                            key={index}
                            // key={option[valueProp]} 
                            value={option[valueProp]} className='text-black'>
                            {option[displayProp]}
                        </option>
                    })}
                </select>
                {error && (
                    <p className="mt-1 mb-1 text-red-500 text-xs text-left">
                        {error.message}
                    </p>
                )}</>
        }


    }
    return (

        <>
            {renderSelect()}

        </>
    );
};

export default Select;