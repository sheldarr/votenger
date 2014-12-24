namespace Votenger.Web.Models
{
    using System.Collections.Generic;
    using DTO;

    public class DraftModel
    {
        public ICollection<GameDto> Games { get; set; }
    }
}
