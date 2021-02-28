import {get} from 'lodash';
import moment from 'moment';

export const types = {
  //--------- SET_MEMBERS -------

  SET_MEMBERS: 'SET_MEMBERS',

  //--------- SET_GUEST_TAB -------

  SET_GUEST_TAB: 'SET_GUEST_TAB',

  //--------- SET_EXTENSION -------

  SET_EXTENSION: 'SET_EXTENSION',
  SET_EXTENSION_ADDON: 'SET_EXTENSION_ADDON',

  // ---- GET_SERVICES ------

  GET_SERVICES_REQUEST: 'GET_SERVICES_REQUEST',
  GET_SERVICES_SUCCESS: 'GET_SERVICES_SUCCESS',
  GET_SERVICES_ERROR: 'GET_SERVICES_ERROR',

  // ---- GET_ADDONS ------

  GET_ADDONS_REQUEST: 'GET_ADDONS_REQUEST',
  GET_ADDONS_SUCCESS: 'GET_ADDONS_SUCCESS',
  GET_ADDONS_ERROR: 'GET_ADDONS_ERROR',

  // ---- GET_TIME_SLOTS ------

  GET_TIME_SLOTS_REQUEST: 'GET_TIME_SLOTS_REQUEST',
  GET_TIME_SLOTS_SUCCESS: 'GET_TIME_SLOTS_SUCCESS',
  GET_TIME_SLOTS_ERROR: 'GET_TIME_SLOTS_ERROR',

  // ---- BOOK_APPOINTMENT ------

  BOOK_APPOINTMENT_REQUEST: 'BOOK_APPOINTMENT_REQUEST',
  BOOK_APPOINTMENT_SUCCESS: 'BOOK_APPOINTMENT_SUCCESS',
  BOOK_APPOINTMENT_ERROR: 'BOOK_APPOINTMENT_ERROR',

  // ---- GUEST_BOOK_APPOINTMENT ------

  BOOK_GUEST_APPOINTMENT_REQUEST: 'BOOK_GUEST_APPOINTMENT_REQUEST',
  BOOK_GUEST_APPOINTMENT_SUCCESS: 'BOOK_GUEST_APPOINTMENT_SUCCESS',
  BOOK_GUEST_APPOINTMENT_ERROR: 'BOOK_GUEST_APPOINTMENT_ERROR',

  // ---- BOOK_ITINERARY_APPOINTMENT ------

  BOOK_ITINERARY_REQUEST: 'BOOK_GUEST_APPOINTMENT_REQUEST',
  BOOK_ITINERARY_SUCCESS: 'BOOK_GUEST_APPOINTMENT_SUCCESS',
  BOOK_ITINERARY_ERROR: 'BOOK_GUEST_APPOINTMENT_ERROR',

  // -------- AVAILABLE DATES ------

  AVAILABLE_DATES_REQUEST: 'AVAILABLE_DATES_REQUEST',
  AVAILABLE_DATES_SUCCESS: 'AVAILABLE_DATES_SUCCESS',
  AVAILABLE_DATES_ERROR: 'AVAILABLE_DATES_ERROR',

  // -------- FIND LOCATION ------

  FIND_LOCATION_REQUEST: 'FIND_LOCATION_REQUEST',
  FIND_LOCATION_SUCCESS: 'FIND_LOCATION_SUCCESS',
  FIND_LOCATION_ERROR: 'FIND_LOCATION_ERROR',

  // -------- FROM EDIT ------

  FROM_EDIT: 'FROM_EDIT',

  // -------- UPDATE APPOINTMENT ------

  UPDATE_APPOINTMENT_REQUEST: 'UPDATE_APPOINTMENT_REQUEST',
  UPDATE_APPOINTMENT_SUCCESS: 'UPDATE_APPOINTMENT_SUCCESS',
  UPDATE_APPOINTMENT_ERROR: 'UPDATE_APPOINTMENT_ERROR',

  // -------- SELECTED LOCATION ------

  SELECTED_LOCATION: 'SELECTED_LOCATION',

  // ------- PROMO CODE ---------

  PROMO_CODE_REQUEST: 'PROMO_CODE_REQUEST',
  PROMO_CODE_SUCCESSS: 'PROMO_CODE_SUCCESSS',
  PROMO_CODE_ERROR: 'PROMO_CODE_ERROR',

  // ------- ADD CC ---------

  ADD_CC_REQUEST: 'ADD_CC_REQUEST',
  ADD_CC_SUCCESS: 'ADD_CC_SUCCESS',
  ADD_CC_ERROR: 'ADD_CC_ERROR',

  // ------- GET CC ---------

  GET_CC_REQUEST: 'GET_CC_REQUEST',
  GET_CC_SUCCESS: 'GET_CC_SUCCESS',
  GET_CC_ERROR: 'GET_CC_ERROR',

  // GET EMPLOYEE

  GET_EMPLOYEE_REQUEST: 'GET_EMPLOYEE_REQUEST',
  GET_EMPLOYEE_SUCCESS: 'GET_EMPLOYEE_SUCCESS',
  GET_EMPLOYEE_ERROR: 'GET_EMPLOYEE_ERROR',

  // SET FAVORITES

  SET_FAVORITES_REQUEST: 'SET_FAVORITES_REQUEST',
  SET_FAVORITES_SUCCESS: 'SET_FAVORITES_SUCCESS',
  SET_FAVORITES_ERROR: 'SET_FAVORITES_ERROR',

  // GET MULTI USER TIME SLOTS

  MULTI_USER_TIMESLOTS_REQUEST: 'MULTI_USER_TIMESLOTS_REQUEST',
  MULTI_USER_TIMESLOTS_SUCCESS: ' MULTI_USER_TIMESLOTS_SUCCESS',
  MULTI_USER_TIMESLOTS_ERROR: ' MULTI_USER_TIMESLOTS_ERROR',

  // BOOKING FORM

  BOOKING_FORM_REQUEST: 'BOOKING_FORM_REQUEST',
  BOOKING_FORM_SUCCESS: 'BOOKING_FORM_SUCCESS',
  BOOKING_FORM_ERROR: 'BOOKING_FORM_ERROR',

  // GET MULTI GUEST AVAIL DATES

  MULTI_GUEST_AVAIL_DATES_REQUEST: 'MULTI_GUEST_AVAIL_DATES_REQUEST',
  MULTI_GUEST_AVAIL_DATES_SUCCESS: 'MULTI_GUEST_AVAIL_DATES_SUCCESS',
  MULTI_GUEST_AVAIL_DATES_ERROR: 'MULTI_GUEST_AVAIL_DATES_ERROR',
};

export const bookingIntialState = {
  totalGuests: [],
  activeGuestTab: 0,
  isExtension: false,
  services: [],
  serviceLoading: false,
  addons: [],
  addonsLoading: false,
  slotsInfo: {},
  slotsLoading: false,
  bookingLoading: false,
  guestLoading: false,
  availableSlots: [],
  locations: [],
  locLoading: false,
  fromEdit: false,
  selectedLocation: {},
  isPromoLoad: false,
  promoData: null,
  isCCLoading: false,
  customerCards: [],
  isEmpLoading: false,
  isFavLoading: false,
  multiUserSlots: [],
  isBooking: false,
  extensionAddon: null,
};

const BookingReducer = (state = bookingIntialState, action) => {
  switch (action.type) {
    //--------- SET_MEMBERS -------

    case types.SET_MEMBERS:
      return {
        ...state,
        totalGuests: action.payload,
      };

    //--------- SET_GUEST_TAB -------

    case types.SET_GUEST_TAB:
      return {
        ...state,
        activeGuestTab: action.payload,
      };

    //--------- SET_EXTENSION -------

    case types.SET_EXTENSION:
      return {
        ...state,
        isExtension: action.payload,
      };

    // ---- GET_SERVICES ------

    case types.GET_SERVICES_REQUEST:
      return {
        ...state,
        serviceLoading: true,
      };

    case types.GET_SERVICES_SUCCESS:
      return {
        ...state,
        serviceLoading: false,
        services: action.payload,
      };

    case types.GET_SERVICES_ERROR:
      return {
        ...state,
        serviceLoading: false,
      };

    // ---- GET_ADDONS ------

    case types.GET_ADDONS_REQUEST:
      return {
        ...state,
        addonsLoading: true,
      };

    case types.GET_ADDONS_SUCCESS:
      let addonArr = get(action, 'payload.Treatments', []);
      return {
        ...state,
        addonsLoading: false,
        addons: addonArr,
      };

    case types.GET_ADDONS_ERROR:
      return {
        ...state,
        addonsLoading: false,
      };

    // ---- GET_TIME_SLOTS ------

    case types.GET_TIME_SLOTS_REQUEST:
      return {
        ...state,
        slotsLoading: true,
      };

    case types.GET_TIME_SLOTS_SUCCESS:
      let slotArr = get(action, 'payload[0]', {});

      // let slotArray = action.payload[0].serviceCategories;

      if (slotArr?.preferredAppointmentTimes) {
        for (let i in slotArr.preferredAppointmentTimes) {
          slotArr.preferredAppointmentTimes[i].open =
            slotArr.preferredAppointmentTimes[i].appointmentTime;
        }
      }

      return {
        ...state,
        slotsLoading: false,
        slotsInfo: slotArr,
        // slotsInfo: slotArray,
      };

    case types.SET_EXTENSION_ADDON:
      return {
        ...state,
        extensionAddon: get(action, 'payload'),
      };

    case types.GET_TIME_SLOTS_ERROR:
      return {
        ...state,
        slotsLoading: false,
      };

    // ---- BOOK_APPOINTMENT ------

    case types.BOOK_APPOINTMENT_REQUEST:
      return {
        ...state,
        bookingLoading: true,
      };

    case types.BOOK_APPOINTMENT_SUCCESS:
      return {
        ...state,
        bookingLoading: false,
      };

    case types.BOOK_APPOINTMENT_ERROR:
      return {
        ...state,
        bookingLoading: false,
      };

    // ---- GUEST_BOOK_APPOINTMENT ------

    case types.BOOK_GUEST_APPOINTMENT_REQUEST:
      return {
        ...state,
        guestLoading: true,
      };

    case types.BOOK_GUEST_APPOINTMENT_SUCCESS:
      return {
        ...state,
        guestLoading: false,
      };

    case types.BOOK_GUEST_APPOINTMENT_ERROR:
      return {
        ...state,
        guestLoading: false,
      };

    // ---- GUEST_BOOK_APPOINTMENT ------

    case types.BOOK_ITINERARY_REQUEST:
      return {
        ...state,
        guestLoading: true,
      };

    case types.BOOK_ITINERARY_SUCCESS:
      return {
        ...state,
        guestLoading: false,
      };

    case types.BOOK_ITINERARY_ERROR:
      return {
        ...state,
        guestLoading: false,
      };

    // -------- AVAILABLE DATES ------

    case types.AVAILABLE_DATES_REQUEST:
      return {
        ...state,
        slotsLoading: true,
      };

    case types.AVAILABLE_DATES_SUCCESS:
      let tempArr = [];

      // console.log('action.payload', action.payload);

      if (get(action.payload, '[0].serviceCategories')) {
        action.payload[0].serviceCategories
          .filter(
            (e) =>
              e.serviceCategoryId ===
              state.totalGuests[state.activeGuestTab].services.Category.ID,
          )
          .map((e) => {
            tempArr.push(e.services[0]);
          });
      }

      // console.log('tempArr>>', tempArr);

      return {
        ...state,
        availableSlots: tempArr,
        slotsLoading: false,
      };

    case types.AVAILABLE_DATES_ERROR:
      return {
        ...state,
        slotsLoading: false,
      };

    // GET MULTI GUEST AVAIL DATES

    case types.MULTI_GUEST_AVAIL_DATES_REQUEST:
      return {
        ...state,
        slotsLoading: true,
      };

    case types.MULTI_GUEST_AVAIL_DATES_SUCCESS:
      const availbilityTimes1 = [];
      get(action.payload, 'availability').forEach((item) => {
        let startTime = moment(item.startDateTime);
        let endTime = moment(item.endDateTime);

        const timezone = moment().utcOffset(item.startDateTime).utcOffset();

        const aTimes = [];

        while (startTime < endTime) {
          aTimes.push({
            ...item,
            timezone,
            startDateTime: startTime
              .utcOffset(timezone)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          });
          startTime = startTime.add(15, 'minutes');
        }
        if (aTimes.length === 0) {
          aTimes.push({
            ...item,
            timezone,
            startDateTime: startTime
              .utcOffset(timezone)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          });
        }

        availbilityTimes = availbilityTimes.concat(aTimes);
      });
      return {
        ...state,
        multiUserSlots: availbilityTimes1,
        slotsLoading: false,
      };

    case types.MULTI_USER_TIMESLOTS_ERROR:
      return {
        ...state,
        slotsLoading: false,
      };

    // -------- FIND LOCATION ------

    case types.FIND_LOCATION_REQUEST:
      return {
        ...state,
        locLoading: true,
      };

    case types.FIND_LOCATION_SUCCESS:
      return {
        ...state,
        locations: action.payload,
        locLoading: false,
      };

    case types.FIND_LOCATION_ERROR:
      return {
        ...state,
        locLoading: false,
      };

    // -------- FROM EDIT ------

    case types.FROM_EDIT:
      return {
        ...state,
        fromEdit: action.payload,
      };

    // -------- UPDATE APPOINTMENT ------

    case types.UPDATE_APPOINTMENT_REQUEST:
      return {
        ...state,
        bookingLoading: true,
      };

    case types.UPDATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        bookingLoading: false,
      };

    case types.UPDATE_APPOINTMENT_ERROR:
      return {
        ...state,
        bookingLoading: false,
      };

    // -------- SELECTED LOCATION ------

    case types.SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload,
      };

    // ------- PROMO CODE ---------

    case types.PROMO_CODE_REQUEST:
      return {
        ...state,
        isPromoLoad: true,
      };

    case types.PROMO_CODE_SUCCESSS:
      return {
        ...state,
        isPromoLoad: false,
        promoData: action.payload,
      };

    case types.PROMO_CODE_ERROR:
      return {
        ...state,
        isPromoLoad: false,
      };

    // ------- ADD CC ---------

    case types.ADD_CC_REQUEST:
      return {
        ...state,
        isCCLoading: true,
      };

    case types.ADD_CC_SUCCESS:
      return {
        ...state,
        isCCLoading: false,
      };

    case types.ADD_CC_ERROR:
      return {
        ...state,
        isCCLoading: false,
      };

    // ------- GET CC ---------

    case types.GET_CC_REQUEST:
      return {
        ...state,
        isCCLoading: true,
      };

    case types.GET_CC_SUCCESS:
      return {
        ...state,
        isCCLoading: false,
        customerCards: action.payload,
      };

    case types.GET_CC_ERROR:
      return {
        ...state,
        isCCLoading: false,
      };

    // GET EMPLOYEE

    case types.GET_EMPLOYEE_REQUEST:
      return {
        ...state,
        isEmpLoading: true,
      };

    case types.GET_EMPLOYEE_SUCCESS:
      return {
        ...state,
        isEmpLoading: false,
      };

    case types.GET_EMPLOYEE_ERROR:
      return {
        ...state,
        isEmpLoading: false,
      };

    // SET FAVORITES

    case types.SET_FAVORITES_REQUEST:
      return {
        ...state,
        isFavLoading: true,
      };

    case types.SET_FAVORITES_SUCCESS:
      return {
        ...state,
        isFavLoading: false,
      };

    case types.SET_FAVORITES_ERROR:
      return {
        ...state,
        isFavLoading: false,
      };

    // GET MULTI USER TIME SLOTS

    case types.MULTI_USER_TIMESLOTS_REQUEST:
      return {
        ...state,
        slotsLoading: true,
      };

    case types.MULTI_USER_TIMESLOTS_SUCCESS:
      let availbilityTimes = [];

      get(action.payload, 'availability').forEach((item) => {
        let startTime = moment(item.startDateTime);
        let endTime = moment(item.endDateTime);

        const timezone = moment().utcOffset(item.startDateTime).utcOffset();

        const aTimes = [];

        while (startTime < endTime) {
          aTimes.push({
            ...item,
            timezone,
            startDateTime: startTime
              .utcOffset(timezone)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          });
          startTime = startTime.add(15, 'minutes');
        }

        if (aTimes.length === 0) {
          aTimes.push({
            ...item,
            timezone,
            startDateTime: startTime
              .utcOffset(timezone)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          });
        }

        availbilityTimes = availbilityTimes.concat(aTimes);
      });

      return {
        ...state,
        slotsLoading: false,
        multiUserSlots: availbilityTimes,
      };

    case types.MULTI_USER_TIMESLOTS_ERROR:
      return {
        ...state,
        slotsLoading: false,
      };

    // BOOKING FORM

    case types.BOOKING_FORM_REQUEST:
      return {
        ...state,
        isBooking: true,
      };

    case types.BOOKING_FORM_SUCCESS:
      return {
        ...state,
        isBooking: false,
      };

    case types.BOOKING_FORM_ERROR:
      return {
        ...state,
        isBooking: false,
      };

    default:
      return state;
  }
};

export default BookingReducer;

export const bookingActions = {
  //--------- SET_MEMBERS -------

  setMembers: (payload) => ({
    type: types.SET_MEMBERS,
    payload,
  }),

  //--------- SET_GUEST_TAB -------

  setGuestTab: (payload) => ({
    type: types.SET_GUEST_TAB,
    payload,
  }),

  //--------- SET_EXTENSION -------

  setExtension: (payload) => ({
    type: types.SET_EXTENSION,
    payload,
  }),

  setExtensionAddon: (payload) => ({
    type: types.SET_EXTENSION_ADDON,
    payload,
  }),

  // ---- GET_SERVICES ------

  getServiceRequest: () => ({
    type: types.GET_SERVICES_REQUEST,
  }),

  getServiceSuccess: (payload) => ({
    type: types.GET_SERVICES_SUCCESS,
    payload,
  }),

  getServiceError: () => ({
    type: types.GET_SERVICES_ERROR,
  }),

  // ---- GET_ADDONS ------

  getAddonRequest: () => ({
    type: types.GET_ADDONS_REQUEST,
  }),

  getAddonSuccess: (payload) => ({
    type: types.GET_ADDONS_SUCCESS,
    payload,
  }),

  getAddonError: () => ({
    type: types.GET_ADDONS_ERROR,
  }),

  // ---- GET_TIME_SLOTS ------

  getSlotsRequest: () => ({
    type: types.GET_TIME_SLOTS_REQUEST,
  }),

  getSlotsSuccess: (payload) => ({
    type: types.GET_TIME_SLOTS_SUCCESS,
    payload,
  }),

  getSlotsError: (payload) => ({
    type: types.GET_TIME_SLOTS_ERROR,
  }),

  // ---- BOOK_APPOINTMENT ------

  bookingRequest: () => ({
    type: types.BOOK_APPOINTMENT_REQUEST,
  }),

  bookingSuccess: (payload) => ({
    type: types.BOOK_APPOINTMENT_SUCCESS,
    payload,
  }),

  bookingError: () => ({
    type: types.BOOK_APPOINTMENT_ERROR,
  }),

  // ---- GUEST_BOOK_APPOINTMENT ------

  guestBookingRequest: () => ({
    type: types.BOOK_GUEST_APPOINTMENT_REQUEST,
  }),

  guestBookingSuccess: (payload) => ({
    type: types.BOOK_GUEST_APPOINTMENT_SUCCESS,
    payload,
  }),

  guestBookingError: () => ({
    type: types.BOOK_GUEST_APPOINTMENT_ERROR,
  }),

  // -------- AVAILABLE DATES ------

  getAvailSlotsRequest: () => ({
    type: types.AVAILABLE_DATES_REQUEST,
  }),

  getAvailSlotsSuccess: (payload) => ({
    type: types.AVAILABLE_DATES_SUCCESS,
    payload,
  }),

  getAvailSlotsError: () => ({
    type: types.AVAILABLE_DATES_ERROR,
  }),

  // GET MULTI GUEST AVAIL DATES

  getMultiDatesRequest: () => ({
    type: types.MULTI_GUEST_AVAIL_DATES_REQUEST,
  }),

  getMultiDatesSuccess: (payload) => ({
    type: types.MULTI_GUEST_AVAIL_DATES_SUCCESS,
    payload,
  }),

  getMultiDatesError: () => ({
    type: types.MULTI_USER_TIMESLOTS_ERROR,
  }),

  // -------- FIND LOCATION ------

  getLocRequest: () => ({
    type: types.FIND_LOCATION_REQUEST,
  }),

  getLocSuccess: (payload) => ({
    type: types.FIND_LOCATION_SUCCESS,
    payload,
  }),

  getLocError: () => ({
    type: types.FIND_LOCATION_ERROR,
  }),

  // -------- FROM EDIT ------

  fromEdit: (payload) => ({
    type: types.FROM_EDIT,
    payload,
  }),

  // -------- UPDATE APPOINTMENT ------

  updateApptRequest: () => ({
    type: types.UPDATE_APPOINTMENT_REQUEST,
  }),

  updateApptSuccess: (payload) => ({
    type: types.UPDATE_APPOINTMENT_SUCCESS,
    payload,
  }),

  updateApptError: () => ({
    type: types.UPDATE_APPOINTMENT_ERROR,
  }),

  // -------- SELECTED LOCATION ------

  setSelectedLocation: (payload) => ({
    type: types.SELECTED_LOCATION,
    payload,
  }),

  // ------- PROMO CODE ---------

  promoCodeRequest: () => ({
    type: types.PROMO_CODE_REQUEST,
  }),

  promoCodeSuccess: (payload) => ({
    type: types.PROMO_CODE_SUCCESSS,
    payload,
  }),

  promoCodeError: () => ({
    type: types.PROMO_CODE_ERROR,
  }),

  // ------- ADD CC ---------

  addCCRequest: () => ({
    type: types.ADD_CC_REQUEST,
  }),

  addCCSuccess: () => ({
    type: types.ADD_CC_SUCCESS,
  }),

  addCCError: () => ({
    type: types.ADD_CC_ERROR,
  }),

  // ------- GET CC ---------

  getCCRequest: () => ({
    type: types.GET_CC_REQUEST,
  }),

  getCCSuccess: (payload) => ({
    type: types.GET_CC_SUCCESS,
    payload,
  }),

  getCCError: () => ({
    type: types.GET_CC_ERROR,
  }),

  // GET EMPLOYEE

  getEmployeeRequest: () => ({
    type: types.GET_EMPLOYEE_REQUEST,
  }),

  getEmployeeSuccess: (payload, extensionData) => ({
    type: types.GET_EMPLOYEE_SUCCESS,
    payload,
    extensionData,
  }),

  getEmployeeError: () => ({
    type: types.GET_EMPLOYEE_ERROR,
  }),

  // SET FAVORITES

  setFavRequest: () => ({
    type: types.SET_FAVORITES_REQUEST,
  }),

  setFavSuccess: () => ({
    type: types.SET_FAVORITES_SUCCESS,
  }),

  setFavError: () => ({
    type: types.SET_FAVORITES_ERROR,
  }),

  // GET MULTI USER TIME SLOTS

  getMultiSlotsRequest: () => ({
    type: types.MULTI_USER_TIMESLOTS_REQUEST,
  }),

  getMultiSlotsSuccess: (payload) => ({
    type: types.MULTI_USER_TIMESLOTS_SUCCESS,
    payload,
  }),

  getMultiSlotsError: () => ({
    type: types.MULTI_USER_TIMESLOTS_ERROR,
  }),

  // BOOKING FORM

  bookingFormRequest: () => ({
    type: types.BOOKING_FORM_REQUEST,
  }),

  bookingFormSuccess: (payload) => ({
    type: types.BOOKING_FORM_SUCCESS,
    payload,
  }),

  bookingFormError: () => ({
    type: types.BOOKING_FORM_ERROR,
  }),
};
