import { type DateAttrs, type DateRecurrenceAttrs, type LayoutAttrs, type Attrs, DateAttrsKey, DateRecurrenceAttrsKey, LayoutAttrsKey, HideIconOption, HideTextOption } from '@/models/attrs';
import { Option, Size, DefaultButtonStyle, DefaultListStyle, DefaultTrigger, DefaultLightMode, DefaultPastDateHandling } from '@/models/addToCalendarButton';
import { DefaultLanguageCode } from '@/models/language';
import { getBrowserTimezone } from '@/utils/timezone';
import { get, LSKey } from '@/utils/localStorage';
import { mergeDeep } from '@/utils/array';

const today = new Date();
const futureDay = new Date();
futureDay.setDate(today.getDate() + 180);
const defaultDate = futureDay.getFullYear() + '-' + ('0' + (futureDay.getMonth() + 1)).slice(-2) + '-' + ('0' + futureDay.getDate()).slice(-2);

export const getDefaultDateRecurrenceAttrs = (): DateRecurrenceAttrs => ({
  [DateRecurrenceAttrsKey.IS_SIMPLE]: false,
  [DateRecurrenceAttrsKey.RRULE_VALUE]: '',
  [DateRecurrenceAttrsKey.FREQUENCY]: '',
  [DateRecurrenceAttrsKey.INTERVAL]: '',
  [DateRecurrenceAttrsKey.COUNT]: '',
  [DateRecurrenceAttrsKey.BY_DAY]: '',
  [DateRecurrenceAttrsKey.BY_MONTH]: [],
  [DateRecurrenceAttrsKey.BY_MONTH_DAY]: '',
});

export const getDefaultDateAttrs = (defaultName: string, defaultDescription: string, defaultLocation: string): DateAttrs => ({
  [DateAttrsKey.NAME]: defaultName,
  [DateAttrsKey.DESCRIPTION]: defaultDescription,
  [DateAttrsKey.START_DATE]: defaultDate,
  [DateAttrsKey.START_TIME]: '10:15',
  [DateAttrsKey.END_DATE]: '',
  [DateAttrsKey.END_TIME]: '17:45',
  [DateAttrsKey.TIMEZONE]: getBrowserTimezone(),
  [DateAttrsKey.LOCATION]: defaultLocation,
  [DateAttrsKey.STATUS]: '',
  [DateAttrsKey.ORGANIZER]: {
    [DateAttrsKey.ORGANIZER_NAME]: '',
    [DateAttrsKey.ORGANIZER_EMAIL]: '',
  },
  [DateAttrsKey.ISC_FILE]: '',
  [DateAttrsKey.RECURRENCE_OBJECT]: getDefaultDateRecurrenceAttrs(),
  [DateAttrsKey.AVAILABILITY]: '',
  [DateAttrsKey.IS_SUBSCRIBED]: false,
  [DateAttrsKey.ICAL_FILE_NAME]: '',
});

export const getDefaultLayoutAttrs = (): LayoutAttrs => ({
  [LayoutAttrsKey.OPTIONS]: [Option.APPLE, Option.GOOGLE, Option.ICAL, Option.OUTLOOK, Option.YAHOO],
  [LayoutAttrsKey.LIST_STYLE]: DefaultListStyle,
  [LayoutAttrsKey.BUTTON_STYLE]: DefaultButtonStyle,
  [LayoutAttrsKey.TRIGGER]: DefaultTrigger,
  [LayoutAttrsKey.HIDE_ICON_OPTIONS]: { [HideIconOption.BUTTON]: false, [HideIconOption.LIST]: false, [HideIconOption.MODAL]: false }, // for playground ui
  [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: { [HideTextOption.BUTTON]: false, [HideTextOption.LIST]: false }, // for playground ui
  [LayoutAttrsKey.IS_BUTTONS_LIST]: false,
  [LayoutAttrsKey.HIDE_BACKGROUND]: false,
  [LayoutAttrsKey.HIDE_CHECKMARK]: false,
  [LayoutAttrsKey.SIZE]: Size.default,
  [LayoutAttrsKey.LABEL]: '',
  [LayoutAttrsKey.LIGHT_MODE]: DefaultLightMode,
  [LayoutAttrsKey.LANGUAGE]: DefaultLanguageCode,
  [LayoutAttrsKey.PAST_DATE_HANDLING]: DefaultPastDateHandling,
});

export const getDefaultAttrs = (defaultName: string, defaultDescription: string, defaultLocation: string): Attrs => ({
  date: getDefaultDateAttrs(defaultName, defaultDescription, defaultLocation),
  layout: getDefaultLayoutAttrs(),
});

export const getInitialAttrs = (defaultName: string, defaultDescription: string, defaultLocation: string): Attrs => {
  const defaultData = getDefaultAttrs(defaultName, defaultDescription, defaultLocation);
  const cachedData = get(LSKey.ATTRS);
  const cachedDataParsed = (function () {
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  })();

  const overrideData = (function () {
    if (!cachedDataParsed) {
      return { layout: { [LayoutAttrsKey.LANGUAGE]: get(LSKey.LANG) } };
    }
    return {};
  })();

  return !!cachedDataParsed && typeof cachedDataParsed === 'object' ? mergeDeep(defaultData, cachedDataParsed) : mergeDeep(defaultData, overrideData);
};
