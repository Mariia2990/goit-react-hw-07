import { createSlice, createSelector } from '@reduxjs/toolkit';
import { addContact, deleteContact, fetchContact } from './operations';
import { selectFilter } from './filtersSlice'; 

const handlePending = (state) => {
        state.loading = true;
      };

const handleRegected = (state, action) => {
        state.loading = false;
        state.error = action.payload;
      };


const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContact.pending, handlePending)
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchContact.rejected, handleRegected)
      .addCase(addContact.pending, handlePending)
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        (state.error = null), state.items.push(action.payload);
      })
      .addCase(addContact.rejected, handleRegected)
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (contact) => contact.id !== action.payload.id
        );
      });
  },

});


export const selectContacts = (state) => state.contacts.items;
export const selectLoading = (state) => state.contacts.loading;
export const selectError = (state) => state.contacts.error;
export const selectFilteredContacts = createSelector(
  [selectContacts, selectFilter],
  (contacts, filter) => {
    if (!contacts) return [];
    return !filter
      ? contacts
      : contacts.filter((contact) =>
          contact.name.toLowerCase().includes(filter.toLowerCase())
        );
  }
);

export default contactsSlice.reducer;