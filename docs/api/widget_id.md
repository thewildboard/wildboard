/**
 * Api Reference Examples
 *-----------------
 *
 * GET /api/widgets/:id
 *-----------------
 * => Returns a widget by an id (especified in the query)
**/

//Returns
{
  "name": "Widget_Name",
  "id": "...",
  "position": {
    "col": 0,
    "row": 0,
    "width": 1,
    "height":1
  },
  "indicator": {
    "source": {
      "provider": {
        "name": "provider_name",
        "token": "..."
      },
      "id": source_index
    },
    values: [...]
  }
}