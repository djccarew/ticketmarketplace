# Event Ticket Network

> This is a ticket marketplace  demo. Create events (eg sporting events, concerts, church picnics etc) and create tickets for those events.  Event tickets can be bought at face value and then redeemed at the event. Buyers can list tickets they have bought and other buyers can buy them (usuallyat prices higher than face value).  By using a Blockchain to record all these transactions, buyers can be assured that they are buying legitimate tickets eliminating much of the fraud that happens on marketplaces like CraigsList. The blockchain will record the entire lifecycle of each ticket, from the  point when it is issued, to when it's sold (and possibly resold multiple times ) to when it is  redeeemed.

This business network defines:

**Participants:**
`Member` `EventHost`

**Assets:**
`Ticket` `TicketListing` `Event`

**Transactions:**
`CreateTicketedEvent` `RedeemTicket` `SellTicket` `ResellTicket`

`CreateTicketedEvent` creates an event as well as the associated tickets. `SellTicket` is used to record the sale of a ticket by the Event Host to a member. `ResellTicket` is used to 
record the resale  of a ticket to another member `RedeemTicket` records when the ticket is used at the event.

To test this Business Network Definition in the **Test** tab:

In the `EventHost` participant registry, create a new participant.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.EventHost",
  "email": "jones@email.com",
  "firstName": "Pastor",
  "lastName": "Jones"
}
```

In the `Member` participant registry, create two participants.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.Member",
  "email": "memberA@email.com",
  "firstName": "Amy",
  "lastName": "Williams"
}

{

  "$class": "org.ibm.demo.ticketmarketplace.Member",
  "email": "memberB@email.com",
  "firstName": "Billy",
  "lastName": "Thompson"
}
```

Submit a `CreateTicketedEvent` transaction, by submitting a transaction and selecting `CreateTicketedEvent` from the dropdown.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.CreateTicketedEvent",
  "eventId": "1001",
  "date": "09/21/2017",
  "description": "Church Picnic",
  "venue": "Austin Methodist Church",
  "eventType": "OPEN_SEATING",
  "numberOfTickets": 5,
  "ticketFaceValue": 10,
  "host": {
    "$class": "org.ibm.demo.ticketmarketplace.EventHost",
    "email": "jones@email.com",
    "firstName": "Pastor",
    "lastName": "Jones"
  }
}
```

Submit a `SellTicket` transaction, by submitting a transaction and selecting `SellTicket` from the dropdown.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.SellTicket",
  "salePrice": 10,
  "buyer": "resource:org.ibm.demo.ticketmarketplace.Member#memberA@email.com",
  "ticket": "resource:org.ibm.demo.ticketmarketplace.Ticket#1"
}
```

In the `TicketListing` asset registry create a new ticket listing

```
{
  "$class": "org.ibm.demo.ticketmarketplace.TicketListing",
  "listingId": "1",
  "state": "FOR_SALE",
  "listingPrice": 12,
  "ticket": "resource:org.ibm.demo.ticketmarketplace.Ticket#1"
}
```

Submit a `ResellTicket` transaction, by submitting a transaction and selecting `ResellTicket` from the dropdown.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.ResellTicket",
  "salePrice": 12,
  "buyer": "resource:org.ibm.demo.ticketmarketplace.Member#memberB@email.com",
  "listing": "resource:org.ibm.demo.ticketmarketplace.TicketListing#1"
}
```

Submit a `UseTicket` transaction, by submitting a transaction and selecting `UseTicket` from the dropdown.

```
{
  "$class": "org.ibm.demo.ticketmarketplace.UseTicket",
  "ticket": "resource:org.ibm.demo.ticketmarketplace.Ticket#1"
}
```



If you click on the `Ticket` asset registry you can check the status  of each Ticket. You should see that one ticket was redeemed and the other are unsold.

Congratulations!