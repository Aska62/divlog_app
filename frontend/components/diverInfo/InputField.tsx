import { UNIT_METRIC, UNIT_IMPERIAL } from '@/constants/unit';
import {
  DiverInfoInputFields,
  DiverInfoInputValues
} from '@/types/diverInfoTypes';

type InputFieldProps = {
  field: DiverInfoInputFields,
  editing: DiverInfoInputFields | '',
  isPending: boolean,
  handleInputChange: (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void
  value?: DiverInfoInputValues<DiverInfoInputFields>,
  measurementUnit?: typeof UNIT_METRIC | typeof UNIT_IMPERIAL
  deleteLangInput?: (index:number) => void,
  addLangInput?: (index:number) => void,
}

const labelText = {
  norecord_dive_count: 'Unrecorded dive',
  height: 'Height',
  weight: 'Weight',
  shoe: 'Shoe size',
  measurement_unit: 'Measurement unit',
  languages: 'Languages',
}

type FieldsWithUnit = Extract<DiverInfoInputFields, 'height' | 'weight' | 'shoe'>;

const isFieldWithUnit = (val:unknown): val is FieldsWithUnit => {
  return ['height', 'weight', 'shoes'].some((f) => f === val);
}

const fieldUnits: Record<
  FieldsWithUnit,
  Record<
    typeof UNIT_METRIC | typeof UNIT_IMPERIAL,
    'cm' | 'Inches' | 'Ib' | 'kg'
  >
> = {
  height: {
    [UNIT_METRIC]: 'cm',
    [UNIT_IMPERIAL]: 'Inches'
  },
  weight:{
    [UNIT_METRIC]: 'Ib',
    [UNIT_IMPERIAL]: 'kg'
  },
  shoe: {
    [UNIT_METRIC]: 'cm',
    [UNIT_IMPERIAL]: 'Inches'
  },
}

const InputField:React.FC<InputFieldProps> = ({
  field,
  editing,
  isPending,
  handleInputChange,
  value,
  measurementUnit,
}) => {
  return (
    <div className="md:flex md:justify-between">
      <label
        htmlFor={field}
        className='text-sm mr-2 md:mt-2 md:w-36'
      >{labelText[field]}:</label>

      <div className='flex flex-col'>
        <div className='flex justify-stretch items-end w-full'>
          {field === 'measurement_unit' ? (
            <select
              name={field}
              id={field}
              value={value || ''}
              onChange={(e) => {if (editing !== field) handleInputChange(e)}}
              disabled={editing !== field}
              className={`${editing === field ? 'bg-lightBlue dark:text-baseBlack appearance-auto' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite appearance-none'} md:w-36 focus:outline-none px-2 py-1 rounded-sm text-lg`}
            >
              <option value={UNIT_METRIC}>Metric</option>
              <option value={UNIT_IMPERIAL}>Imperial</option>
            </select>
          ) : isFieldWithUnit(field) ? (
            <>
              <input
                type="number"
                name={field}
                id={field}
                value={value || ''}
                onChange={(e) => {if (editing === field) handleInputChange(e)}}
                disabled={editing !== field || isPending}
                className={`${editing === field ? 'bg-lightBlue dark:text-baseBlack md:w-36' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-20'} dark:text-baseBlack focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm text-lg`}
              />
              {(!!value || editing === field) &&
                <span className={`${editing === field ? 'bg-lightBlue dark:text-baseBlack' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} text-sm h-9 py-2 pr-2 rounded-tr-sm rounded-br-sm`}>
                  {measurementUnit === UNIT_IMPERIAL ? fieldUnits[field][UNIT_IMPERIAL ] : 'cm'}
                </span>
              }
            </>
          ) : (
            <input
              type="number"
              name={field}
              id={field}
              value={value || ''}
              onChange={(e) => { if (editing === field) handleInputChange(e)}}
              disabled={editing !== field || isPending}
              className={`${editing === field ? 'bg-lightBlue dark:text-baseBlack ' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} md:w-36 focus:outline-none px-2 py-1 rounded-sm text-lg`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default InputField;