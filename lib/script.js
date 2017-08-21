/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Called when the  ticket is scanned at the event
 * @param {org.ibm.demo.ticketmarketplace.UseTicket} useTicket - the useTicket transaction
 * @transaction
 */
function useTicket(useTicket) {
	
	var ticket = useTicket.ticket;
	// Can't redeem an unsold ticket
	if (ticket.state == 'UNSOLD') {
		throw new Error('Ticket was never sold');
	}

	ticket.state = 'USED';

	return getAssetRegistry('org.ibm.demo.ticketmarketplace.Ticket')
	.then(function (ticketRegistry) {
		// save the ticket
		return ticketRegistry.update(ticket);
	});

}

/**
 * Called when the  ticket is initially sold 
 * @param {org.ibm.demo.ticketmarketplace.SellTicket} sellTicket - the sellTicket transaction
 * @transaction
 */

function sellTicket(sellTicket) {
	var ticket = sellTicket.ticket;
	// First time sold
	if (ticket.state != 'UNSOLD') {
		throw new Error('Ticket has already been sold');
    }			
	ticket.salePrice = ticket.faceValue;
    ticket.state = 'INITIAL_SALE';
	ticket.owner = sellTicket.buyer;
	return getAssetRegistry('org.ibm.demo.ticketmarketplace.Ticket')
	   .then(function (ticketRegistry) {
		    // save the ticket
		   return ticketRegistry.update(ticket);
	    });
		
	
}



/**
 * Called to create an event
 * @param {org.ibm.demo.ticketmarketplace.CreateTicketedEvent} createTicketedEvent - the createTicketedEvent transaction
 * @transaction
 */

function createTicketedEvent(createTicketedEvent) {
	
    var NS = "org.ibm.demo.ticketmarketplace";
	var factory = getFactory();
    var ticketedEvent = factory.newResource(NS, 'TicketedEvent', createTicketedEvent.eventId);
	ticketedEvent.date = createTicketedEvent.date;
	ticketedEvent.description = createTicketedEvent.description;
	ticketedEvent.venue = createTicketedEvent.venue;
	ticketedEvent.eventType = createTicketedEvent.eventType;
    ticketedEvent.numberOfTickets = createTicketedEvent.numberOfTickets;
    ticketedEvent.host = createTicketedEvent.host;
	
	var tickets = [];
	
    for (var i = 1; i <= ticketedEvent.numberOfTickets; i++) {
	   var ticket =  factory.newResource(NS, 'Ticket', i.toString());
	   ticket.seatId = ticket.ticketId;
	   ticket.faceValue = createTicketedEvent.ticketFaceValue;
	   ticket.state = 'UNSOLD';
	   ticket.event = factory.newRelationship(NS, 'TicketedEvent', ticketedEvent.eventId);
	   tickets.push(ticket);
    }
	
	
     return getAssetRegistry('org.ibm.demo.ticketmarketplace.TicketedEvent')
	   .then(function (ticketedEventRegistry) {
		   // save the ticket
		   return ticketedEventRegistry.add(ticketedEvent);
	    })
		.then(function() {return getAssetRegistry('org.ibm.demo.ticketmarketplace.Ticket')})
		   .then(function(ticketRegistry) {
			   return ticketRegistry.addAll(tickets);
		   });
	

}

/**
 * Called when the  ticket is resold 
 * @param {org.ibm.demo.ticketmarketplace.ResellTicket} resellTicket - the resellTicket transaction
 * @transaction
 */

function resellTicket(resellTicket) {
	var listing = resellTicket.listing;
	// First time sold
	if (listing.state != 'FOR_SALE') {
		throw new Error('Ticket is not for resale');
    }			
	listing.ticket.salePrice = listing.listingPrice;
    listing.ticket.state = 'RESALE';
	listing.ticket.owner = resellTicket.buyer;
	listing.ticket.lastSeller = resellTicket.seller;
	listing.state = 'SOLD';
	return getAssetRegistry('org.ibm.demo.ticketmarketplace.Ticket')
	   .then(function (ticketRegistry) {
		   // save the ticket
		   return ticketRegistry.update(listing.ticket);
	    })
		.then(function() {return getAssetRegistry('org.ibm.demo.ticketmarketplace.TicketListing')})
		   .then(function(ticketListingRegistry) {
			   return ticketListingRegistry.update(listing);
		   });
		 
	

}

